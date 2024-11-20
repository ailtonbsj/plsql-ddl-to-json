import * as url from "node:url";
import { getParserFromFile } from "@griffithswaite/ts-plsql-parser";

export async function plsqlToJs(fileName: string) {

    const __dirname = url.fileURLToPath(new URL(".", import.meta.url));
    const parser = await getParserFromFile(__dirname + fileName);

    const sqlObj = { columns: {} };
    const schema = parser.create_table();
    sqlObj['schemaName'] = schema.schema_name().getText();
    sqlObj['tableName'] = schema.table_name().getText();

    const properties = schema.relational_table().relational_property_list();
    properties.map(property => {

		const columnDefinition = property.column_definition();
		if (columnDefinition !== null) {
            const col = { key: false };

            const datatype = columnDefinition.datatype();
			if(datatype !== null) {
                col['nativeType'] = datatype.native_datatype_element().getText();
                
                const precision = datatype.precision_part();
                if(precision !== null) {
                    col['len'] = precision.numeric(0).getText();
                }
                
			}

            const inline = columnDefinition.inline_constraint_list();
            if(inline !== null && inline.length > 0) {
                const inline0 = inline[0];

                if(datatype !== null) {
                    if(inline0.NOT() !== null && inline0.NULL_() !== null) {
                        col['nullable'] = false;    
                    }
                    if(inline0.NOT() === null && inline0.NULL_() !== null) {
                        col['nullable'] = true;
                    }
                }

                const check = inline0.check_constraint();
                if(check !== null) {
                    const unary = check.condition().expression()
                        .logical_expression().unary_logical_expression();
                    if(unary.getText().includes('ISNOTNULL')) {
                        const colName = unary.multiset_expression().getText().replaceAll('"','');
                        sqlObj.columns[colName].nullable = false;   
                    }        
                }

            }
            
            const columnName = columnDefinition.column_name();
            if(columnName !== null && datatype !== null) {
                col['name'] = columnName.getText();
                sqlObj.columns[columnName.getText()] = col;
            }
            
		}
        
        const outOfLineConstraint = property.out_of_line_constraint();
        if (outOfLineConstraint !== null) {

            const primary = outOfLineConstraint.PRIMARY();
            if(primary !== null) {
                outOfLineConstraint.column_name_list().map(name => {
                    sqlObj.columns[name.getText()].key = true;
                });
            }

            const foreignKey = outOfLineConstraint.foreign_key_clause();
            if(foreignKey !== null) {

                let colRef;
                
                const parenCols = foreignKey.paren_column_list();
                if(parenCols !== null) {
                    colRef = parenCols.column_list().column_name(0).getText();
                }

                const references = foreignKey.references_clause();
                if(references !== null) {

                    const foreignTable = references.tableview_name().getText();
                    sqlObj.columns[colRef].foreignTable = foreignTable;
                    const foreignColumn = references.paren_column_list().column_list().column_name(0).getText();
                    sqlObj.columns[colRef].foreignColumn = foreignColumn;
                    
                }
                
            }

		}

	});

    return sqlObj;

}
