
import DataSource from "./Components/DataSource/dataSource";
import Facts from "./Components/Facts";
import AnalyticsDetails from "./Components/AnalyticsDetails";

import AccessibilityAndSharing from "../../Shared/Componets/AccesibilityAndSharing";
import React from 'react'
import RelatedIndicator from "../../Shared/Componets/RelatedIndicatorTable";
import Introduction from "./Components/introduction/introduction";


export default function DataElementPage(props){
    const id=props.id

    return (<div style={{display:"flex",flexDirection:"column"}}>
            <Introduction id={id} />
            <DataSource id={id}  />
            <Facts  id={id}  />
            <AnalyticsDetails id={id}/>

            <h3>{i18n.t("Related Indicators")} </h3>
            <RelatedIndicator id={id} resourceType={"Data Element"}  />

            <AccessibilityAndSharing id={id} resourceType={"dataElements"} />

    </div>
    )

}

