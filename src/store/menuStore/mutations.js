export const mutations = {
    changeData(state,data){
        state[data.key]= data.value
    },
    changeProducts(state,data){
        state.products[data.type]=data.value
    }
}