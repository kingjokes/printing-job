

export const CreateFormData = (payload) =>{

    let formData = new FormData()
    for(const item in payload){
        formData.append(item, payload[item])
    }

    return formData
}