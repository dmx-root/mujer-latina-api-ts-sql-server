class DetOpQueve{

    #items:Array<() => Promise< void | Response >> = [];
    
    enqueve(item : () => Promise< void | Response >){
        this.#items.push( item );
    }
    dequeve(){
        return this.#items.shift();
    }
    isEmpty(){
        return this.#items.length === 0;
    }

}

const queve=new DetOpQueve();

export async function enquveProcessInsertInfoOp(detOpList:Array<any>,openBy:string){
    try {
        detOpList.forEach((element,index)=>{
            const insertInformation=async(message:string)=>{

                // const [response]=await db.query('CALL SP_MANAGEMENT_ML_DB_OP_OPEN(?,?,?,?,?,?,?,?,?)',
                // [element.op,
                // element.referencia, 
                // element.talla, 
                // element.ean, 
                // element.colorId, 
                // element.colorLabel, 
                // element.planeada, 
                // element.pendiente,
                // openBy]);
                // console.log(message);
                
            };  

            function waitingPromise(message:string){ 

                return ()=>{
                    return insertInformation(message);
                }

            }
            
            queve.enqueve(waitingPromise(`Ejecuted async function det OP ${index}...`));
            
        });
    } catch (error) {

    }
}