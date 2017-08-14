function avatar(_avatar, _name, _color, _size){

    var sizes = {
        mini: 15,
        small: 20,
        medium: 30,
        big: 40,
        veryBig: 60,
        huge: 120
    };

    return '<DIV class="avtContainerStyle"> ' +
                '<DIV class="avtStyle" style="background-color: ' + _color + '; width: ' + sizes[_size] + 'px; height:' + sizes[_size] + 'px; border-radius:' + sizes[_size] / 2 + 'px ">' +
                '    <DIV class="abbrStyle">' + _avatar + '</DIV>' +
                '</DIV>' +
                '<DIV class="nameStyle textStyle" style="font-size: ' + ((sizes[_size] / 2) - 2) + '">' + _name + '</DIV>' +
            '</DIV>';

}

function task(_title, _subtitle, _avatar) {
    return  '<DIV class="containerStyle">' +         
            '    <DIV class="topContainerStyle">' +   
            '       <DIV class="percentStyle">' +   
            '            <DIV class="percentText">50%</DIV>' +   
            '        </DIV>' +   
            '        <DIV style="flex: 1">' +   
            '            <DIV class="titlecontainer" style="flex: 1" >' +   
            '                <Text class="titleText">' + _title + '</Text>' +   
            '            </DIV>' +   
            '            <DIV class="subTitleContainer">' +   
            '                <DIV class="subTitleText">' + _subtitle + '</DIV>' +   
            '            </DIV>' +   
            '            <DIV class="subTitleContainer" style="flex: 1; margin-bottom: 10">' +   
                            avatar(_avatar.avatar, _avatar.name, _avatar.theme, _avatar.size) +
            '            </DIV>' +                   
            '        </DIV>' +   
            '    </DIV>' +   
            '    <DIV class="bottomContainerStyle">' +   
            '        <DIV class="smallContainers separator">' +   
            '            Due date' +                          
            '        </DIV>' +   
            '        <DIV class="smallContainers separator">' +   
            '            <DIV class="smallTitle">Resume</DIV>' +                      
            '        </DIV>' +   
            '        <DIV class="smallContainers separator">' +   
            '            <Img src=""' +   
            '                class="checkImage"' +   
            '            />' +   
            '        </DIV>' +                                     
            '    </DIV>' +   
            '</DIV>'    
}