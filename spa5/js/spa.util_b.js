/*
 * spa.util_b.js
 * javascript browser utilities
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.util_b = (function(){
    'use strict'
    var
        configMap={
            regexp_encode_html : /[&"'><]/g,
            regexp_encode_noamp : /["'><']/g,
            html_encode_map : {
                '&' : '&#38',
                '"' : '&#34',
                "'" : '&#39',
                '>' : '&#62',
                '<' : '&#60'
            }
        },
        decodehtml,encodehtml,getEmSize;

        configMap.html_encode_noamp = $.extend(true,{},configMap.html_encode_map);
        delete configMap.html_encode_noamp['&'];

        decodehtml = function(str){
            return $('<div/>').html(str || '').text()
        }

        encodehtml = function(input_arg_str,exclude_amp){
            var
                input_str = String(input_arg_str),
                regex,lookup_map;

            if (exclude_amp){
                regex = configMap.regexp_encode_noamp;
                lookup_map = configMap.html_encode_noamp;

            }else{
                regex = configMap.regexp_encode_html;
                lookup_map = configMap.html_encode_map;
            }

            return input_str.replace(regex,
                function(match,name){
                    return lookup_map[match] || '';
                }
            );
        };

        getEmSize = function(elem){
            return Number(
                getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0]
            );
        };

        return {
            decodehtml:decodehtml,
            encodehtml:encodehtml,
            getEmSize:getEmSize
        };
}());