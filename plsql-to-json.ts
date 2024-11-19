export function sqlDdlOracleToJson(sql: string) {

    const lines = sql.split('\n').map(line => line.trim()).filter(line => line.length !== 0);
    const cmds = lines.filter(line =>
        !line.startsWith('--') &&
        !line.startsWith('CREATE UNIQUE INDEX') &&
        !line.startsWith('CREATE INDEX') &&
        !line.startsWith(');')
    );

    const schem = cmds.filter(cmd => cmd.startsWith('CREATE TABLE'));
    const constraintsArr = cmds.filter(cmd => cmd.startsWith('CONSTRAINT')).map(cons => cons.replace('CONSTRAINT ', ''));
    const columns = cmds.filter(cmd => !cmd.startsWith('CREATE TABLE') && !cmd.startsWith('CONSTRAINT'));
    const [schema, table] = schem[0].replace(/CREATE|TABLE|\(/g, '').trim().split('.');

    const cols = columns.map(col => {
        const colExpr = col.split(' ');
        const column = colExpr[0];
        const typeArr = colExpr[1].split('(');
        const type = typeArr[0].replace(',', '');
        let len;
        let scale;

        if (['VARCHAR2', 'NUMBER'].includes(type)) {
            if (typeArr[1] === undefined) { len = 32 }
            else { [len, scale] = typeArr[1].replace('),', '').split(',') }
        }
        return { column, type, len, scale };
    });

    const constraints = constraintsArr.map(cons => {
        const consExpr = cons.split(' ');
        switch (consExpr[1]) {
            case 'PRIMARY':
                const keys = consExpr.slice(3).join('').replace(/\(|\)|/g, '').split(',').filter(t => t !== '');            
                return { constraintType: 'primaryKeys', keys }
            case 'FOREIGN':
                const expr1 = consExpr.slice(2);
                const col1 = expr1[1].replace(/\(|\)/g, '');
                const targetExpr = expr1[3].replace(/\,/g, '');
                const tExpr = targetExpr.split('(');
                const schemaTable = tExpr[0];
                const schema = schemaTable.split('.')[0];
                const table = schemaTable.split('.')[1];
                
                const column = tExpr[1].replace(/\)/s, '');
                return { constraintType: 'foreignKey', column: col1, target: { schema, table, column } }
            case 'CHECK':
                const expr = consExpr.slice(2);
                const col = expr[0].replace(/\(|"/g, '');
                if (expr.join(' ').includes('IS NOT NULL')) {
                    return { constraintType: 'notNullable', col }
                } else if (expr.join(' ').includes('IS NULL')) {
                    return { constraintType: 'nullable', col }
                }
        }
        return consExpr[1]
    });

    return { schema, table, cols, constraints };

}

export function normalizeDdlJson(struct: any) {
        
    const cols: any = {};
    struct.cols.map((col: any) => {
        cols[col.column] = col;
        cols[col.column].key = false;
        cols[col.column].nullable = true;
    });
    struct.constraints.map((item: any) => {
        switch (item.constraintType) {
            case 'primaryKeys':
                item.keys.map((key: any) => cols[key].key = true);
                break;
            case 'notNullable':
                cols[item.col].nullable = false;
                break;
            case 'foreignKey':
                cols[item.column].targetClass = item.target.schema + '.' + item.target.table;
                cols[item.column].targetProperty = item.target.column;
        }
    });
    return cols;
}