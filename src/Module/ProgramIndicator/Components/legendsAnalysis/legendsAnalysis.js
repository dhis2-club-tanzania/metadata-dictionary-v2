import { CircularLoader } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'
import Legend from './legend'
import React, { useEffect} from 'react'
import Loader from "../../../../Shared/Componets/Loaders/Loader";
import Error from "../../../../Shared/Componets/Error/ErrorAPIResult";

const query =    {
  legendAnalysis:{
    resource:"programIndicators",
      id: ({id})=>id,
      params:{
        fields:["id","displayName","legendSets[id,displayName,legends[id,displayName,startValue,endValue,color]]"]
      }
  } 
}

export default function LegendsAnalysis({id}){

    const {loading, error, data,refetch}  = useDataQuery(query, {variables: {id}})

    useEffect(()=>{refetch({id})},[id])

    if(loading){
        return  <Loader text={""} />
    }if(error){
        return <Error error={error} />
    }



    if(data?.legendAnalysis?.legendSets?.length===0){
       return <><p>There are no legends associated with these Program Indicator</p></> //no legends sets
     }

     const legendSet=data?.legendAnalysis?.legendSets

     return (
       <div>
          <h3>Legends for analysis</h3>
          <p>
              Uses {legendSet?.length} legends for for analysis, spread accross multiple cut-off points of interest, existing legends are:
          </p>
          <ul>
            {legendSet?.map((legendSet)=>{
              return <Legend key={legendSet?.id} legendSet={legendSet} />
            })}
          </ul>
         
      </div>
     )
}