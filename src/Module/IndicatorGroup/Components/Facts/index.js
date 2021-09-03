import React, {useEffect} from 'react'
import {useDataQuery} from "@dhis2/app-runtime";
import Loader from "../../../../Shared/Componets/Loaders/Loader";
import Error from "../../../../Shared/Componets/Error/ErrorAPIResult";

import {useRecoilValue} from "recoil";
import _ from "lodash";
import {
    indicatorGroupAggregateDataElements,
    indicatorGroupDataSets,
    indicatorGroupProgramDataElements,
    indicatorGroupPrograms
} from "../../../../Store/IndicatorGroup";
import IndicatorCount from "../../../../Shared/Componets/IndicatorCount";

const query = {
    sources:{
        resource:"indicatorGroups",
        id: ({id})=>id,
        params:{
            fields:["indicators"]
        }
    },

}


export default function Facts({id}){

    const {loading, error, data,refetch}  = useDataQuery(query, {variables: {id}})

    useEffect(()=>{refetch({id})},[id])


    let dataSets=useRecoilValue(indicatorGroupDataSets)
    let programs=useRecoilValue(indicatorGroupPrograms)
    let programDtEl=useRecoilValue(indicatorGroupProgramDataElements)
    let dataElements=useRecoilValue(indicatorGroupAggregateDataElements)

    if(loading){
        return  <Loader text={""} />
    }if(error){
        return <Error error={error} />
    }


    dataSets=_.uniqWith(dataSets,_.isEqual)
    programs=_.uniqWith(programs,_.isEqual)
    dataElements=_.uniqWith(dataElements,_.isEqual)



    programDtEl=programDtEl.map((e)=>{
        return {id:e.split(".")[1]??""}
    })
    dataElements=dataElements.map((e)=>{
        return {id:e}
    })

    const allDataElements=_.concat([],programDtEl,dataElements)



    return <div>
        <h3>Indicator group Facts
        </h3>

        <ul>
            <li> It has {data?.sources?.indicators?.length} indicators     </li>
            <li>It’s data elements belongs to {dataSets?.length} datasets and {programs?.length} program sources of data</li>
            <li>
                <IndicatorCount dataElementsArray={allDataElements}/>
            </li>
        </ul>
    </div>
}