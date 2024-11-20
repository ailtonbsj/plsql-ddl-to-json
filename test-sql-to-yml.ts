/**
 * 
 *  Testing: Generate JSON and YML example from PL/SQL
 * 
*/

import { plsqlToJs } from './plsql-to-js'
import { upperSnakeToCamel, upperSnakeToPascal, upperSnakeToTitle } from './string-util'

function getJavaType(sqlType: string, len: string) {
	const length = parseInt(len);
	if (sqlType === 'VARCHAR2' && length === 1) return 'Character';
	else if (sqlType === 'CHAR') return 'Character';
	else if (sqlType === 'VARCHAR2' && length > 1) return 'String';
	else if (sqlType === 'DATE') return 'LocalDate';
	else if (sqlType === 'NUMBER' && length === 1) return 'Integer';
	else if (sqlType === 'NUMBER' && length > 1) return 'Long';
	else  return 'Object';
}

function getUI(sqlType: string, len: string) {
	const length = parseInt(len);
	if (sqlType === 'VARCHAR2' && length === 1) return 'slidetoggle';
	else if (sqlType === 'CHAR') return 'slidetoggle';
	else if (sqlType === 'VARCHAR2' && length > 1) return 'inputtext';
	else if (sqlType === 'DATE') return 'inputdate';
	else if (sqlType === 'NUMBER' && length === 1) return 'slidetoggle';
	else if (sqlType === 'NUMBER' && length > 1) return 'inputnumber';
	else return 'none';
}

function printYml(normObj: object) {
	Object.values(normObj)
		.sort((a: any, b: any) => {
			if(a.key && !b.key) return -1;
			if(!a.key && b.key) return 1;
			return 0;
		}).map(col => {
		console.log('- property: ' + upperSnakeToCamel(col.name));
		console.log('  column: ' + col.name);
		console.log('  javaType: ' + getJavaType(col.nativeType, col.len));
		console.log('  uiComponent: ' + getUI(col.nativeType, col.len));
		console.log('  label: ' + upperSnakeToTitle(col.name));
		console.log('  key: ' + col.key);
		console.log('  nullable: ' + col.nullable);
		console.log('  search: true');
		if (col.foreignTable !== undefined) {
			console.log('  # targetClass: ' + upperSnakeToPascal(col.foreignTable.split('.')[1]));
			console.log('  # targetProperty: ' + upperSnakeToCamel(col.foreignColumn));
		}
		console.log();
	});
}

async function main() {

	// const userObj = await plsqlToJs('example-user.sql');
	// printYml(userObj.columns);

	const obj = await plsqlToJs('example.sql');
	
	console.log(`--- JSON ---\n`);
	console.log(obj);

	console.log(`\n--- YAML ---\n`);
	printYml(obj.columns);

}

main();