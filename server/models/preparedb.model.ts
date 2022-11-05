import { createConn, mssql } from "../../utils/backend/db"

const init = async (): Promise<void> => {
    const conn:mssql.ConnectionPool|undefined = await createConn()
    
    new mssql.Request(conn).query('select 10')

    // Create User table
    new mssql.Request(conn)
        .query(
            `if not exists (select * from sys.tables where name = 'Users')
            create table Users (
                ID int identity(1,1),
                Username varchar(256) unique,
                Password varbinary(max)
            )`
        )
}

export default init