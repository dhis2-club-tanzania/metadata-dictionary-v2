import {CircularLoader, DataTableCell,} from '@dhis2/ui'
import {useDataEngine, useDataQuery} from '@dhis2/app-runtime'
import {useEffect, useState} from "react";
import {atom, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {dataElementsStateDictionary, programIndicatorStateDictionary} from "../../store";


const query1={
    dataElement:{
      resource:"dataElements",
      id: ({idEle})=>idEle,
        params:{
          fields:["id","displayName"]
        }
    },
    categoryOptionCombo:{
      resource:"categoryOptionCombos",
      id: ({idComb})=>idComb,
      params:{
        fields:["id","displayName"]
      }
    }
  }
  const query2={
    dataElement:{
      resource:"dataElements",
      id: ({idEle})=>idEle,
        params:{
          fields:["id","displayName"]
        }
    }
}
const query3={
    programIndicator:{
        resource:"programIndicators",
        id: ({idEle})=>idEle,
        params:{
            fields:["id","displayName"]
        }
    }
}


function CalculationDetailRow(props){

let testArr=[]
//structure of dataElemet in store is 
    // [
    //     {
    //         "id":"dfds3ds.fdaf",
    //         "val":"value from api",
    //         "exprPart":"num/den",
    //     }
    // ]

    //props
    const formula=props.formula
    const loc=props.location

    //variables
    let wordDtEl=[]
    let programInd=[]


    //hooks
    const[dataElementsArray,setDataElementArray]=useState([])
    const[programIndicatorArray,setProgramIndicatorArray]=useState([])
    const engine = useDataEngine()
    const updateDataElementHandler= useSetRecoilState(dataElementsStateDictionary)
    const updateProgramIndicatorHandler= useSetRecoilState(programIndicatorStateDictionary)

        useEffect(()=>{
            let tempArr=getFormulaSources(formula,"#")
            if(tempArr.length){
                getWordDataEle(tempArr,0),()=>{}
            }

            },[])

        useEffect(()=>{
            let tempArr=getFormulaSources(formula,"I{")

            if(tempArr.length){

                getWordDataEle(tempArr,1),()=>{}
            }

            },[])


    //functions

    function setCharAt(str,index,chr) {
        if(index > str.length-1) return str;
        return str.substring(0,index) + chr + str.substring(index+1);
    }

    function getFormulaSources(formula,sourceInitial){
        let ind1=0
        let ind2=0
      let arr=[]

        while(formula.search(sourceInitial)>=0){//there is still a dataElement
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

        return arr
    }

    async function getWordDataEle(arr,type){ //arr for array of id of datas to get their values, type indicates the data type of data eg dataElement=0 program indicator=1
        let allPromises=[];
        let i=0
        for(i=0;i<arr.length;i++){
            let proms=getValueFromApi(arr[i],type)
            allPromises.push(proms)
        }
        i=0
       await Promise.all(allPromises).then(value => {
           if(type===0){
               value.map((val)=>{ //We always return array just for uniformity
                   if(val.length>1){ //array of two elements first element is dataElement second element of array is category option combo
                       wordDtEl.push({"id":arr[i],"val":val[0]+" "+val[1],"location":loc})
                   }else{   //this is array of one element for data element that are just pure no category options
                       wordDtEl.push({"id":arr[i],"val":val[0],"location":loc})
                   }
                   ++i;
               })
           }
           if(type===1){
               value.map((val)=>{ //We always return array just for uniformity
                   programInd.push({"id":arr[i],"val":val[0]+" "+val[1],"location":loc})
                   ++i;
               })
           }


           if(wordDtEl.length===arr.length){ //array is full so we reload to update UI
               setDataElementArray(wordDtEl)
               updateDataElementHandler( (prev)=>{
                   return  prev.concat(wordDtEl)
               } )
           }
            if(programInd.length===arr.length){
                setProgramIndicatorArray(programInd)
                updateProgramIndicatorHandler((prev)=>{
                    return  prev.concat(programInd)
                }  )
            }
        })
    }

    function getFormulaInWordsFromFullSources(formula,arrOfSources){

        for( let i=0;i<arrOfSources.length;i++){
            if(formula.search(arrOfSources[i].id)>=0){
                formula=formula.replace(arrOfSources[i].id,arrOfSources[i].val);   
            }  
        }
        return formula
    }

    function isPureDataElement(str){
        if(str.indexOf(".")==-1){ //didnt find
            return true
        }else{
            return false;
        }  
    }

    function getValueFromApi(strEle,type){

    if(type===0){ //dataElement
        if(isPureDataElement(strEle)){
            //fetch value normally
            return new Promise((resolve, reject) => {
                resolve(getValueDataElementOnly(strEle))
            })
        }else{
            //break to array and just take first element
            return new Promise(((resolve, reject) => {
                let arr = strEle.split(".")
                resolve(getValueDataElementOptionCombo(arr[0], arr[1]));
            }))
        }
    }
    if(type===1){//programIndicator

        return new Promise((resolve, reject) => {
            resolve(getValueProgramIndicator(strEle))
        })
    }
    }

    async function getValueDataElementOnly(idEle){

        const data = await engine.query(query2,{variables: {idEle}})

         return [data?.dataElement?.displayName]
    }

    async function getValueProgramIndicator(idEle){

        const data = await engine.query(query3,{variables: {idEle}})
        return [data?.programIndicator?.displayName]
    }

    async function getValueDataElementOptionCombo(idEle,idComb){
        const data= await engine.query(query1,{variables: {idEle,idComb}})
         return [data?.dataElement?.displayName, data?.categoryOptionCombo?.displayName]

    }

    function getFinalWordFormula(formula){

        let final=getFormulaInWordsFromFullSources(formula,dataElementsArray).replace(/#/g,"")
        final =getFormulaInWordsFromFullSources(final,programIndicatorArray)
            while(final.search("I{")>=0) {//removes I
                let indexChar=final.search("I{")
                final = setCharAt(final, indexChar, "")
            }
                return final
    }

    return      <>
                <DataTableCell  bordered>
                    {getFinalWordFormula(formula)}
                </DataTableCell>
                <DataTableCell  bordered>
                    <h5>Data Elements</h5>
                     <ol>
                         {dataElementsArray.map((el)=>{
                             return <li key={(el.id)}>{el.val}</li>
                         })}
                     </ol>
                    <h5>Program Indicators</h5>
                    <ol>
                        {programIndicatorArray.map((el)=>{
                            return <li key={(el.id)}>{el.val}</li>
                        })}
                    </ol>
                </DataTableCell>
             </>
}

export default CalculationDetailRow;