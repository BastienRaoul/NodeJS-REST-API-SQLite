const app = new Vue({
    el: '#app',
    data() {
        return {
            name: 'toto',
            items: ['gg', 'kkk']


        }
    },
    methods: {
        monAction: function(e){
            this.items.push("ggg");
        }
    }
});