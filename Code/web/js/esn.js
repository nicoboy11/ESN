$(document).ready(function(){

    window.onload = load();

    function load(){

        var tasks = '';

        for(var i = 0; i < 10; i++){
            tasks += '<li>' + task('new task', 'project', {avatar: 'ES', name:'Even Sosa', theme: '#4F5A23', size: 'medium'}) + '</li>';
        }

        $("#leftDiv").html('<ul>' + tasks + '</ul>');
    }

});