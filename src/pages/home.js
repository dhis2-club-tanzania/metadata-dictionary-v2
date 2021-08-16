import { Menu,MenuItem,CircularLoader } from '@dhis2/ui'
import { useDataQuery } from '@dhis2/app-runtime'

import { useHistory } from "react-router-dom";

import { useContext,useEffect } from "react";
import DataElementContext from '../store/dataElementContext';
import {useSetRecoilState} from "recoil";
import {dataElementsState} from "../Components/calculationDetails/calculationDetailRow";


const query = {
    indicators: {
        resource: 'indicators',
        params: {
            fields: 'id,displayName',
        },paging:false,
    },
}

function HomePage(){

   const history = useHistory();

    const {loading, error, data}   = useDataQuery(query)

    const updateRecoilHandler=useSetRecoilState(dataElementsState)
    function navigateToIndicatorHandler(id){
        updateRecoilHandler([])
        history.push("/indicator/"+id);
    }

    if(loading){
       return <CircularLoader />
    }


    if(error){
       return <p> {error} </p> 
    }

    return(<div>

       
        <p> <b>Select an Indicator for details </b></p>  
      
            <Menu>
       
            {data.indicators.indicators.map( (ind)=>{
                    return(
                   
                        <MenuItem key={ind.id} onClick={()=>navigateToIndicatorHandler(ind.id)} label={ind.displayName} />

                    )
                } )}
            </Menu>
       
       

    </div>)
}

export default HomePage;