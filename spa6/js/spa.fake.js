/*
 * spa.fake.js
 * fake Module
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.fake = (function(){
    'use strict';
    var fakeIdSerial,makeFakeId,mockSio,peopleList;
    fakeIdSerial = 5;
    makeFakeId = function(){
        return 'id_'+String(fakeIdSerial++)
    }

    peopleList =[
            {name:'Betty',_id:'id_01',
            css_map:{top:20,left:20,
                'background':'rgb(128,128,128)'}
            },
            {name:'Mike',_id:'id_02',
            css_map:{top:60,left:20,
                'background':'rgb(128,128,128)'}
            },
            {name:'Pebbles',_id:'id_03',
            css_map:{top:100,left:20,
                'background':'rgb(128,128,128)'}
            },
            {name:'Wilma',_id:'id_04',
            css_map:{top:140,left:20,
                'background':'rgb(128,128,128)'}
            }
        ];
    mockSio = (function(){
        var on_sio,emit_sio,
            send_listchange, listchange_idto,
            callback_map={};

        on_sio = function(msg_type,callback){
            callback_map[msg_type] = callback;
        }

        emit_sio = function(msg_type,data){
            var person_map;
            if (msg_type === 'adduser' && callback_map.userupdate){
                person_map = {_id : makeFakeId(),
                            name: data.name,
                            css_map : data.css_map
                };
                peopleList.push(person_map);
                setTimeout(function(){
                    callback_map.userupdate(
                        [person_map]
                    );
                },3000);
            }
        };

        send_listchange = function  () {
            listchange_idto = setTimeout(function  () {
                if (callback_map.listchange){
                    callback_map.listchange([peopleList]);
                    listchange_idto = undefined;
                }
                else{
                    send_listchange()
                }
            },1000);
        };
        send_listchange();

        return {emit:emit_sio,on:on_sio}
    }());
    return {mockSio:mockSio}
}());