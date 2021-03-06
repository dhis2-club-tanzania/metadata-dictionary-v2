
import React, {useState,useEffect,useRef} from "react";
import { Field } from '@dhis2/ui'
import {Input} from "@material-ui/core";
import { Modal,ButtonStrip,Button,ModalTitle,ModalContent,ModalActions, Radio } from '@dhis2/ui'
import SearchResult from "./Components/SearchResult.js";
import classes from "../../TopSection.module.css"
import {useGetSearchResult} from "../../../../Utils/Hooks/TopBar";
import {dataSourceTypes, dataTypes} from "../../../../Utils/Models";
import {useDataEngine} from "@dhis2/app-runtime";
import Loader from "../../../../Shared/Componets/Loaders/Loader";
import Error from "../../../../Shared/Componets/Error/ErrorAPIResult";
import {selector, useRecoilCallback, useRecoilState, useRecoilValue, useSetRecoilState} from "recoil";
import {searchKeywordTopBar, selectedRadioSearchTopBar} from "../../../../Store/TopBar";
import {forEach} from "lodash";
import _ from "lodash";
import { useHistory } from "react-router-dom";
import {useReactToPrint} from "react-to-print";
import {
    allFunctionsRulesInStore, oneFunctionSelected,
    searchedResultRules, showAllFunctions,
    showFunctionsSearchResult
} from "../../../../Store/FunctionDictionary";

export default function TopSection({handlePrint}){


    const history = useHistory();
    const engine=useDataEngine();
    const [searchKeyWord,setSearchKeyWord]= useRecoilState(searchKeywordTopBar)
    const [selectedSource,setSelectedSource]=useRecoilState(selectedRadioSearchTopBar);

    const{loading,error,data}=useGetSearchResult(searchKeyWord,selectedSource,engine)

    const resetAllOnFunctions = useRecoilCallback(({reset}) => () => {
        reset(allFunctionsRulesInStore)
        reset(showFunctionsSearchResult)
        reset(searchedResultRules)
        reset(oneFunctionSelected)
        reset(showAllFunctions)
        reset(searchKeywordTopBar)
    })


    const [radioSelector,setRadioSelector]=useState([0,0,0,0])


    useEffect(()=>{
        updateRadioSelector(0)
        setSearchKeyWord("")
        return ()=>{
            resetAllOnFunctions()
        }


    },[])


    const  debounceInputHandler=_.debounce(inputHandler,1000)
    const debounceRadioSelectorHandler=_.debounce(updateRadioSelector,1)

    function inputHandler(str){
        setSearchKeyWord(str)
    }


    function navigateToFunctionHandler(){
        history.push("/functions")

    }

    function updateRadioSelector(index){
        let tmp=[0,0,0,0]
        tmp[index]=1
        setRadioSelector(tmp)
        if(index==0){
            setSelectedSource(dataSourceTypes.DATA_ELEMENT)
        }
        if(index==1){
            setSelectedSource(dataSourceTypes.DATA_ELEMENT_GROUP)
        }
        if(index==2){
            setSelectedSource(dataSourceTypes.INDICATOR)
        }
        if(index==3){
            setSelectedSource(dataSourceTypes.DATA_ELEMENT_GROUP)
        }

    }


    if(loading){
        return  <Loader text={""} />
    }if(error){
        return <Error error={error} />
    }



    return <div>
        <div className={classes.container} >
            <div>
                <Field label="Search">
                    <Input label="An second input" name="input2" onChange={(e)=>{debounceInputHandler(e.target.value)}} />
                </Field>
            </div>

            <div className={classes.topComponents}>Search in:</div>

            <div className={classes.topComponents}>
                <Radio  checked={false}  label="Data Element"  onChange={()=>{debounceRadioSelectorHandler(0)}} checked={radioSelector[0]}   />

            </div>
            <div className={classes.topComponents}>
                <Radio  checked={false}  label="Data Element Group"  onChange={()=>{debounceRadioSelectorHandler(1)}} checked={radioSelector[1]}  />

            </div>
            <div className={classes.topComponents}>
                <Radio  checked={false}  label="Indicator"  checked={radioSelector[2]} onChange={()=>{debounceRadioSelectorHandler(2)}}    />

            </div>
            <div className={classes.topComponents}>
                <Radio  checked={false}  label="Indicator Group" checked={radioSelector[3]} onChange={()=>{debounceRadioSelectorHandler(3)}}  />

            </div>


            <div className={classes.printButton}>
                  <span style={{marginRight:12}}>
                       <Button  checked={false}    onClick={navigateToFunctionHandler} > Functions </Button>

                  </span>

                <Button  onClick={handlePrint} >
                    Print
                </Button>
            </div>


        </div>

        <SearchResult result={data} />
    </div>

}




