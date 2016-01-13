/*
 * spa.shell.js
 * char feature module for spa
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa, getComputedStyle */

spa.chat = (function(){
    // BEGIN MODULS SCOPE VARIABLES
    var
        configMap={
            main_html : String()
            +'<div class="spa-chat">'
                +'<div class="spa-chat-head">'
                    +'<div class="spa-chat-head-toggle">+</div>'
                    +'<div class="spa-chat-head-title">'
                        +'Chat'
                    +'</div>'
                +'</div>'
                +'<div class="spa-chat-closer">x</div>'
                +'<div class="spa-chat-sizer">'
                    +'<div class="spa-chat-msgs"></div>'
                    +'<div class="spa-chat-box">'
                        +'<input type="text"/>'
                        +'<div>send</div>'
                    +'</div>'
                +'</div>'
            +'</div>',
            settable_map:{
                slider_open_time: true,
                slider_close_time:true,
                slider_open_em:true,
                slider_closed_em:true,
                slider_open_title:true,
                slider_closed_title:true,

                chat_model:true,
                people_model:true,
                set_chat_anchor:true
            },
            slider_open_time: 250,
            slider_close_time:250,
            slider_open_em:18,
            slider_closed_em:2,
            slider_open_title:'Click to close',
            slider_closed_title:'Click to open',
            slider_opened_min_em:10,
            window_heigth_min_em:20,

            chat_model:null,
            people_model:null,
            set_chat_anchor:null
        },
        stateMap = {
            $append_target:null,
            position_type:'closed',
            px_per_em:0,
            slider_hidden_px:0,
            slider_closed_px:0,
            slider_opened_px:0

        },
        jqueryMap = {},
        getEmSize,setPxSizes,setSliderPosition,onClickToggle,removeSlider,handlerResize,
        setJqueryMap,configModule,initModule;
    // END MODULS SCOPE VARIBLES
    // BEGIN UTILITY METHODS
    getEmSize = function(elem){
        return Number(getComputedStyle(elem,'').fontSize.match(/\d*\.?\d*/)[0]);
    }
    // END UTILITY METHODS
    // BGIN DOM METHODS
    setJqueryMap = function(){
        var
            $append_target = stateMap.$append_target;
            $slider = $append_target.find('.spa-chat');

            jqueryMap={
                $slider:$slider,
                $head:$slider.find('.spa-chat-head'),
                $toggle:$slider.find('.spa-chat-head-toggle'),
                $title:$slider.find('.spa-chat-head-title'),
                $sizer:$slider.find('.spa-chat-sizer'),
                $box:$slider.find('.spa-chat-box'),
                $msgs:$slider.find('.spa-chat-msgs'),
                $input:$slider.find('.spa-chat-input input[type=text]')
            };
    };
    setPxSizes = function(){
        var px_per_em,open_height_em,window_heigth_em;
        px_per_em = getEmSize(jqueryMap.$slider.get(0));
        window_heigth_em = Math.floor($(window).height()/px_per_em + 0.5 );
        open_height_em = window_heigth_em > configMap.window_heigth_min_em ?
                    configMap.slider_open_em : configMap.slider_opened_min_em;

        stateMap.px_per_em = px_per_em;
        stateMap.slider_opened_px = open_height_em * px_per_em;
        stateMap.slider_closed_px = configMap.slider_closed_em * px_per_em;

        jqueryMap.$sizer.css({
            height:(open_height_em - 2) * px_per_em
        });
    }
    // END DOM METHODS
    // BEGIN HANDLER METHODS
    onClickToggle = function(event){
        var set_chat_anchor = configMap.set_chat_anchor;
        if (stateMap.position_type === 'opened'){
            set_chat_anchor('closed');
        }else if(stateMap.position_type === 'closed'){
            set_chat_anchor('opened');
        }
        return false;
    }
    // END HANDLER METHODS
    // BEGIN PUBLIC METHODS
    removeSlider = function(){
        if (jqueryMap.$slider){
            jqueryMap.$slider.remove();
            jqueryMap = {}
        }

        stateMap.$append_target = null;
        stateMap.$position_type = 'closed';

        stateMap.set_chat_anchor = null;
        stateMap.chat_model = null;
        stateMap.people_model = null;
    }

    handlerResize = function(){
        if (!jqueryMap.$slider){return false;}

        setPxSizes();
        if (stateMap.position_type ==='opened'){
            jqueryMap.$slider.css({height:stateMap.slider_opened_px})
        }
        return true;
    }
    setSliderPosition = function(position_type, callback){
        var height_px,animate_time,slider_title,toggle_text;

        if(position_type === stateMap.position_type){return true;}

        switch(position_type){
            case 'opened':
                height_px = stateMap.slider_opened_px;
                animate_time = configMap.slider_open_time;
                slider_title = configMap.slider_open_title;
                toggle_text = '=';
                break;

            case 'closed':
                height_px = stateMap.slider_closed_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
                break;

            case 'hidden':
                height_px = stateMap.slider_hidden_px;
                animate_time = configMap.slider_close_time;
                slider_title = configMap.slider_closed_title;
                toggle_text = '+';
                break;
            default:
                return false;
        }

        stateMap.position_type = ''
        jqueryMap.$slider.animate(
                {height:height_px},
                animate_time,
                function(){
                    jqueryMap.$toggle.prop('title',slider_title);
                    jqueryMap.$toggle.text(toggle_text);
                    stateMap.position_type = position_type;
                    if (callback) {return callback(jqueryMap.$slider);}
                }
            )
        return true;
    };

    configModule = function(input_map){
        spa.util.setConfigMap({
            input_map:input_map,
            settable_map:configMap.settable_map,
            config_map:configMap
        });
        return true;
    };

    initModule = function($append_target){
        $append_target.append(configMap.main_html);
        stateMap.$append_target = $append_target;
        setJqueryMap();
        setPxSizes();
        jqueryMap.$toggle.prop('title',configMap.slider_closed_title);
        jqueryMap.$head.click(onClickToggle);
        stateMap.position_type = 'closed';
        return true
    };
    return {
        setSliderPosition:setSliderPosition,
        configModule:configModule,
        removeSlider:removeSlider,
        handlerResize:handlerResize,
        initModule:initModule
    };
    // END PUBLIC METHODS
}());