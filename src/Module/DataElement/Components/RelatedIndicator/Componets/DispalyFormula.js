import {useDataEngine} from '@dhis2/app-runtime'
import {useEffect, useState} from "react";
import {    getDetailedValueFromApi,    getFinalWordFormula,    getFormulaSources} from "../../../../../Utils/Functions/FormulaFunctions";
import {dataTypes} from "../../../../../Utils/Models";
import PropTypes from "prop-types";

export default function DispalyFormula(props){
    //props
    const formula=props.formula
    const loc=props.location

    //variables
    let wordDtEl=[]
    let programInd=[]
    let dataSetReportingRates=[]

    //hooks
    const[dataElementsArray,setDataElementArray]=useState([])
    const[programIndicatorArray,setProgramIndicatorArray]=useState([])
    const[dataSetReportingRatesArray,setDataSetReportingRatesArray]=useState([])
    const engine = useDataEngine()


    useEffect(()=>{
        let tempArr=getFormulaSources(formula,"#{")

        if(tempArr.length){
            getWordData(tempArr,0),()=>{}
        }

    },[])
    useEffect(()=>{
        let tempArr=getFormulaSources(formula,"I{")
        if(tempArr.length){
            getWordData(tempArr,1),()=>{}
        }

    },[])
    useEffect(()=>{
        let tempArr=getFormulaSources(formula,"R{")
        if(tempArr.length){
            getWordData(tempArr,2),()=>{}
        }
    },[])

    //functions
    async function getWordData(arr,type){ //arr for array of id of datas to get their values, type indicates the data type of data eg dataElement=0 program indicator=1, reporting rates=2
        let allPromises=[];
        let i=0
        for(i=0;i<arr.length;i++){
            let proms=getDetailedValueFromApi(engine,arr[i],type)
            allPromises.push(proms)
        }
        i=0
        await Promise.all(allPromises).then(value => {
            if(type===dataTypes.DATA_ELEMENT){
                value.map((val)=>{ //We always return array just for uniformity
                    if(val.length===2){ //array of two elements first element is dataElement second element of array is category option combo
                        wordDtEl.push({id:arr[i],val:val[0].displayName+" "+val[1],location:loc,sources:val[0].dataSetElements})
                    }if(val.length===1){   //this is array of one element for data element that are just pure no category options

                        wordDtEl.push({id:arr[i],val:val[0].displayName,"location":loc,sources:val[0].dataSetElements})
                    }
                    ++i;
                })
            }
            if(type===dataTypes.PROGRAM_INDICATOR){
                value.map((val)=>{ //We always return array just for uniformity
                    programInd.push({"id":arr[i],"val":val[0].displayName,"location":loc,sources:val[0].program})
                    ++i;
                })
            }
            if(type===dataTypes.DATASET_REPORTING_RATES){
                value.map((val)=>{ //We always return array just for uniformity
                    dataSetReportingRates.push({"id":arr[i],"val":val[0],"location":loc})
                    ++i;
                })
            }

            if(wordDtEl.length===arr.length){ //array is full so we reload to update UI
                setDataElementArray(wordDtEl)

            }
            if(programInd.length===arr.length){
                setProgramIndicatorArray(programInd)

            }
            if(dataSetReportingRates.length===arr.length){
                setDataSetReportingRatesArray(dataSetReportingRates)

            }
        })
    }

    return      <div>

        {getFinalWordFormula(formula,dataElementsArray,programIndicatorArray,dataSetReportingRatesArray,[],[])}

    </div>
}

DispalyFormula.prototype={
    formula:PropTypes.string.isRequired,

}