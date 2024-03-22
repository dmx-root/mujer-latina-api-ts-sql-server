import sql from 'mssql';


export interface dbParameters{
    name:string;
    type:
    | sql.ISqlTypeFactoryWithLength
    | sql.ISqlTypeFactoryWithNoParams
    | sql.ISqlTypeFactoryWithPrecisionScale
    | sql.ISqlTypeFactoryWithScale
    | sql.ISqlTypeFactoryWithTvpType;
    value: any
}