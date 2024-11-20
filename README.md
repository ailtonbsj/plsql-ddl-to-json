# PL/SQL DDL (create table only) to JSON and YML

This project converts PL/SQL code of creating tables in Oracle 11g to JSON or YAML.

> Obs: Not mapping composite foreign keys. Treating as single foreign key.

## History of commands

```bash
# Install node with typescript support
npm i -D tsx
npm i -D typescript

# Install plsql parser
npm i @griffithswaite/ts-plsql-parser

# Run example
./node_modules/.bin/tsx test-sql-to-yml.ts
```

### Tools

[PL/SQL AST Viewer](https://plsql-ast-viewer.vercel.app/)


### References

[https://github.com/griffiths-waite/ts-plsql-parser](https://github.com/griffiths-waite/ts-plsql-parser)