<!DOCTYPE html>
<html>
<i style="display:block;width: 80px;height: 100px;background-image: url('/highchart/static/img/index/index/dd.svg');background-size: 100% 100%"></i>
<style>
    ul{
        border: 3px solid #ddd;
    }
</style>
<div id="app">

    <input v-model="input.name" v-on:keyup.enter="addTodo">
    <div id="item-{{ id + b }}" v-if="greeting">{{{ raw_html }}}</div>
    <a v-bind:href="url">dddddddddddddddddd</a>
    <ul>
        <li v-for="line in lines" v-bind:class="liObj.class" v-bind:style="liObj.style">
            <span>{{ line.text }}</span>
            <button v-on:click="removeTodo($index)">X</button>
        </li>
    </ul>
</div>
<script>
    // 设置值

    var index;
    $(function(){
        index = new Vue({
            el: '#app',
            created: function () {
                if(sessionStorage.sessionId){
                    sessionStorage.setItem('sessionId', '<?=md5(time().rand(0,99999))?>');
                }else{
                    sessionStorage.setItem('sessionId', '<?=md5(time().rand(0,99999))?>');
                }
            },
            compiled: function () {},
            data:
            {
                liObj: {
                    'class': {
                        "a": true,
                        "c": true,
                        "b": false
                    },
                    'style': {
                        'color': "red",
                        'margin-top': "10px"
                    }
                },
                url: 'http://www.baidu.com',
                greeting: true,
                id: "jdj",
                raw_html: "<b>ddd</b>",
                input: {
                    name: "dd"
                },
                lines: [
                    {text: 'Add some todos'},
                    {text: 'Add some todos'}
                ]
            },
            computed: {
                b: {
                    get: function () {
                        return this.id;
                    },
                    set: function (val) {
                        this.id = val;
                    }
                }
            },
            methods: {
                addTodo: function () {
                    var text = this.input.name;
                    if (text) {
                        this.lines.push({text: text});
                        this.input.name = ''
                    }
                },
                removeTodo: function (index) {
                    this.lines.splice(index, 1)
                }
            }
        });
    });


</script>
</html>
