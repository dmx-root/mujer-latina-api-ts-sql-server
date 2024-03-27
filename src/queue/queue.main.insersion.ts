import {Response} from 'express';

export class Queue{

    #items:Array<() => Promise< Response | void >> = [];
    
    enqueve(item : () => Promise< Response | void>){
        this.#items.push( item );
    }
    dequeve(){
        return this.#items.shift();
    }
    isEmpty(){
        return this.#items.length === 0;
    }

}
