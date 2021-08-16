import { useParams,useHistory } from 'react-router-dom'
import CalculationDetails from '../Components/calculationDetails/calculationDetails'

import CompletenessDataSources from '../Components/completenessDataSources'
import DataElementSIndicator from '../Components/dataElementsInIndicator/dataElementsIndicator'

import DatasetsReportingRates from '../Components/datasetsReportingRates'
import DataSource from '../Components/dataSource/dataSource'

import IndicatorFacts from '../Components/indicatorFacts/indicatorFacts'
import Introduction from '../Components/introduction/introduction'
import LegendsAnalysis from '../Components/legendsAnalysis/legendsAnalysis'
import ProgramIndicatorIndicator from '../Components/programIndicatorIndicator'


export default function IndicatiorPage(){

    const { id } = useParams()


    return (<div style={{display:"flex",flexDirection:"column"}}>
       <Introduction id={id} />

       <DataSource id={id} />

       <IndicatorFacts id={id} /> 

       <LegendsAnalysis id={id} />

       <CalculationDetails id={id} />

       <DataElementSIndicator />

       <ProgramIndicatorIndicator    />

        <DatasetsReportingRates />

        <CompletenessDataSources />

       </div>)



}


 