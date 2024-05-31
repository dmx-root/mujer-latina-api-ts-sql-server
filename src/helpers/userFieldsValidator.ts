import * as yup                 from 'yup';

interface ApiResponse {
    apiCode: -1 | 0 | 1,
    apiMessage: string,
    data?:any,
    dataLength?:number;
    date?: string;
    status:number
}

export const userFieldValidator : ( {field, value}: {field: "nombre" | "estado" |"prf_id" | "contrasena" | "descripcion" | "doc_id", value: string})=>Promise<ApiResponse> = async ({field, value})=> {

    const fieldList = [
        "nombre",
        "estado",
        "prf_id",
        "contrasena",
        "descripcion",
        "doc_id",
    ];

    const verify = fieldList.find(ele =>ele===field)

    if(!verify){
        const apiResponse: ApiResponse = {
            apiCode:-1,
            status:500,
            date: new Date().toDateString(),
            apiMessage: `El campo <<${field}>> no coincide con la estructura de la entidad, valide la información`
        }
        return apiResponse;
    }

    const listValidator ={ 
        "nombre":{
            schema: yup.object().shape({
                value:
                yup.
                string().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                min(1).
                max(50).
                strict(), 
            })
        },
        "estado":{
            schema: yup.object().shape({
                value:
                yup.
                boolean().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                strict(), 
            })
        },
        "prf_id":{
            schema: yup.object().shape({
                value:
                yup.
                number().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                min(1).max(5).
                strict(), 
            })
        },
        "contrasena":{
            schema: yup.object().shape({
                value:
                yup.
                string().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                min(1).
                max(100).
                strict(), 
            })
        },
        "descripcion":{
            schema: yup.object().shape({
                value:
                yup.
                string().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                min(1).
                max(50).
                strict(), 
            })
        },
        "doc_id":{
            schema: yup.object().shape({
                value:
                yup.
                number().
                required(`No se obtuvo valores para el campo <<${field}>>`).
                min(1).
                max(5).
                strict(), 
            })
        },
    }

    try {
        await listValidator[field].schema.validate({value});
        const apiResponse: ApiResponse = {
            apiCode: 1,
            status:200,
            apiMessage: 'Consulta exitosa',
            date:new Date().toLocaleDateString()
        }
        return apiResponse;

    } catch (error) {
        const errors:any=error
        const apiResponse: ApiResponse = {
            apiCode:-1,
            status:500,
            date: new Date().toLocaleDateString(),
            apiMessage: errors.errors[0] 
        }
        return apiResponse;
    }

}