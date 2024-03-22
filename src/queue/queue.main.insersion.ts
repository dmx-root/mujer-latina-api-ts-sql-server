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

export async function runQueve(){ 
    try {

        while ( !queve.isEmpty() ) {
    
            const fn = queve.dequeve();
            if (fn !== undefined)
            await fn();
    
        }
        
    } catch (error) {
        console.log(error)
    }

}