import {atom} from "recoil";

export const dataElementsStateDictionary = atom({
    key: 'dataElementsStoreDictionary', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

export const programIndicatorStateDictionary=atom({
    key:'programIndicatorStateDictionary',
    default:[]
})

export const dataSetReportingRatesStateDictionary=atom({
    key:'dataSetReportingRatesStateDictionary',
    default:[]
})

export const dataSourceStateDictionary=atom({
    key:'dataSourceStateDictionary',
    default:{id:undefined,type:undefined}
})

export const dataSetDataElementCountState=atom({
    key:"dataSetDataElementsCountState",
    default:0
})

export const programDataElementCountState=atom({
    key:"programDataElementCountState",
    default:0
})


