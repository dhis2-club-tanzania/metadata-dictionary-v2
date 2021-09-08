import React from 'react'
import Introduction from "./Components/Introduction";
import DataSource from "./Components/DataSource";
import Rules from "./Components/Rules";
import Facts from "./Components/Facts";
import ApiEndPoint from "./Components/ApiEndPoint";
import AccessibilityAndSharingFunction from "./Components/AccessibilityAndSharing";
import {functionDictionarySourceSelector} from "../../Store/FunctionDictionary";
import {useRecoilValue} from "recoil";


export default function FunctionPage({ruleObj,functionObj}){

   // const selectedFunction=useRecoilValue(functionDictionarySourceSelector)
    console.log(ruleObj)
    console.log(functionObj)

    return <div>
        {/*<Introduction ruleObj={selected}  />*/}
        {/*<DataSource selected={selected}/>*/}
        {/*<Rules selected={selected} />*/}
        {/*<Facts selected={selected} />*/}
        {/*<ApiEndPoint selected={selected} />*/}
        {/*<AccessibilityAndSharingFunction selected={selected} />*/}
    </div>
}