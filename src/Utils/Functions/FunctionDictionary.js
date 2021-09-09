const query={

    functions:{
        resource: 'dataStore/functions',
        id: ({id})=>id,
    }
}


export async function getFunctionDetails(engine,arr){
    let allPromises = arr?.map((id) => {
        return new Promise((resolve, reject) => {
            resolve(getDetails(engine, id))
        })
    })
    return await Promise.all(allPromises).then(value => {
        return value.map((val, index) => {
            return val
        })
    })
}

async function getDetails(engine,id){
    const data=await engine.query(query,{variables:{id}})
    return data?.functions
}


function findUid(str){ //find something that starts as an UId
    let re=/[a-zA-Z]/g
    let pos=str?.search(re)
    return pos
}
function isValidUId(testStr){
    let res =testStr.search("^[A-Za-z0-9]+$")  //using search method is faster
    return res>=0 //if it finds anything that is not listed in the regex it returns -1
}

export function getAllId(json){
    let allId=[]
    let str=json
    let pos=findUid(str?.toString())

    while(pos >=0 ){
        str=str.substring(pos)
        let testStr=str.substring(0,11)

        if( isValidUId(testStr) ){
            allId.push(testStr)
            str=str.substring(11)
        }
        else {
            let failInd=str.search(/[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/) //helps to reduce string length much faster

            str=str.substring(failInd)
        }
        pos=findUid(str)

    }
    return allId

}