import {dataTypes} from "../Models";

const query1={
    identifiableObjects:{
        resource:"identifiableObjects",
        id: ({id})=>id,
        params:{
            fields:["id","displayName","href"]
        }
    }
}

const query2={
    identifiableObjects:{
        resource:"identifiableObjects",
        id: ({id})=>id,
        params:{
            fields:["id","displayName","href"]
        }
    },
    identifiableObjects2:{
        resource:"identifiableObjects",
        id: ({id2})=>id2,
        params:{
            fields:["id","displayName","href"]
        }
    }
}


export function getFormulaSources(formula,sourceInitial){
    let ind1=0
    let ind2=0
    let arr=[]

    while(formula?.search(sourceInitial)>=0){//there is still a dataElement
        ind1=formula.indexOf(sourceInitial) //first occourance
        let subStr= formula.substr(ind1)
        ind2=subStr.indexOf("}")
        ind2=ind2+ind1

        let datEl = formula.substring(ind1+2,ind2);
        arr.push(datEl)

        formula= setCharAt(formula,ind1,"")         //remove {
        formula= setCharAt(formula,ind1-1,"")       //removes #
        formula=setCharAt(formula,ind2-2,"")          //removes }

    }

    if(sourceInitial==="R{"){
        let resultedArr=[]
        arr.filter((ele)=>{
            resultedArr.push(ele.split(".")[0])  //elements comes as BfMAe6Itzgt.REPORTING_RATE or OsPTWNqq26W.EXPECTED_REPORTS so we do this to just take the id
        })
        arr=resultedArr
    }

    return arr
}

export function setCharAt(str,index,chr) {
    if(index > str.length-1) return str;
    return str.substring(0,index) + chr + str.substring(index+1);
}

async function getValueIdentifiableObjects2(engine,id,id2){
    const data= await engine.query(query2,{variables: {id,id2}})
    return [data?.identifiableObjects?.displayName, data?.identifiableObjects2.displayName]
}

async function getValueIdentifiableObjects(engine,id){
    const data=await engine.query(query1,{variables:{id}})
    return [data?.identifiableObjects?.displayName]
}

async function getValueDataSource(engine,id){
    const data=await engine.query(query1,{variables:{id}})
    return [data?.identifiableObjects]
}

export function getFormulaInWordsFromFullSources(formula,arrOfSources) {

    for( let i=0;i<arrOfSources.length;i++){
        if(formula?.search(arrOfSources[i].id)>=0){
            formula=formula.replace(arrOfSources[i].id,arrOfSources[i].val);
        }
    }
    return formula
}

export function getFinalWordFormula(formula,dataElementsArray,programIndicatorArray,dataSetReportingRatesArray,attributes,constants){

    let final=getFormulaInWordsFromFullSources(formula,dataElementsArray)?.replace(/#/g,"")
    final =getFormulaInWordsFromFullSources(final,programIndicatorArray)
    final =getFormulaInWordsFromFullSources(final,dataSetReportingRatesArray)
    final =getFormulaInWordsFromFullSources(final,attributes)
    final =getFormulaInWordsFromFullSources(final,constants)


    while(final?.search("I{")>=0) {//removes I
        let indexChar=final.search("I{")
        final = setCharAt(final, indexChar, "")
    }

    while(final?.search("R{")>=0) {//removes R
        let indexChar=final.search("R{")
        final = setCharAt(final, indexChar, "")
    }

    while(final?.search("A{")>=0) {//removes A
        let indexChar=final.search("A{")
        final = setCharAt(final, indexChar, "")
    }
    while(final?.search("C{")>=0) {//removes C
        let indexChar=final.search("C{")
        final = setCharAt(final, indexChar, "")
    }
    while(final?.search("V{")>=0) {//removes C
        let indexChar=final.search("V{")
        final = setCharAt(final, indexChar, "")
    }


    return cleanBrackets(final)
}

export function getValueFromApi(engine,id){

    if(isPureDataElement(id)){
        //fetch value normally
        return new Promise((resolve, reject) => {
            resolve(getValueIdentifiableObjects(engine,id))
        })
    }else{
        //break to array and just take first element
        return new Promise(((resolve, reject) => {
            let arr = id.split(".")
            resolve(getValueIdentifiableObjects2(engine,arr[0], arr[1]));
        }))
    }


}

export function getValueDataSourcePromise(engine,id){
    return new Promise((resolve, reject) => {
        resolve(getValueDataSource(engine,id))
    })
}


 function cleanBrackets(formula){
    if(typeof(formula) !=dataTypes.UNDEFINED){
        let arr= formula.split("{");
        arr=arr.join("")
        arr=arr.split("}")
        //string = array.join("")
        arr=arr.join(" ")
        return arr
    }

}

function isPureDataElement(str){
    if(str.indexOf(".")==-1){ //didnt find
        return true
    }else{
        return false;
    }
}