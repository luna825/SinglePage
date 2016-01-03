/*
 * spa.shell.js
 * shell module for spa
*/

/*jslint           browser : true,   continue : true,
  devel  : true,    indent : 2,       maxerr  : 50,
  newcap : true,     nomen : true,   plusplus : true,
  regexp : true,    sloppy : true,       vars : false,
  white  : true
*/
/*global $, spa */
spa.shell = (function(){
    // --BEGIN MODULE SCOPE VARIALBES--
    var 
        configMap={
            main_html: String()
                + '<div class="spa-shell-head">'
                    + '<div class="spa-shell-head-logo"></div>'
                    + '<div class="spa-shell-head-acct"></div>'
                    + '<div class="spa-shell-head-search"></div>'
                + '</div>'
                + '<div class="spa-shell-main">'
                    + '<div class="spa-shell-main-nav"></div>'
                    + '<div class="spa-shell-main-content"></div>'
                + '</div>'
                + '<div class="spa-shell-foot"></div>'
                + '<div class="spa-shell-chat"></div>'
                + '<div class="spa-shell-model"></div>',
                chat_extended_height:450,
                chat_retract_height:16,
                chat_extended_title:'Click to retract',
                chat_retract_title:'Click to extend',
                anchor_schema_map:{
                    chat:{open:true,closed:true}
                }
        },
        stateMap = {
            $container:null,
            is_chat_retracted:true,
            anchor_map :{}
        },
        jqueryMap={},
        copyAnchorMap,changeAnchorPart,onHashChange,
        setJqueryMap,toggleChat,onClickChat,initModule;
    // --END MODULE SCOPE VARIALBES--
    // --BEGIN UTILITY METHODS--
        // Begin unti method /copyAnchorMap/
        copyAnchorMap=function(){
            return $.extend(true, {}, stateMap.anchor_map);
            
        }
        // End unti mentod /copyAnchorMap/
    // --END UTILITY METHODS--
    // --BEGIN DOM METHODS--
        // begin dom method /setJquerMap/
        setJqueryMap = function(){
            var $container = stateMap.$container;
            jqueryMap={
                $container:$container,
                $chat:$container.find('.spa-shell-chat')
            }
        };
        // end dom method /setJqueryMap/
        // begin dom method /changeAnchorPart/
        changeAnchorPart = function(arg_map){
            var
                anchor_map_revise = copyAnchorMap(),
                bool_return = true,
                key_name,key_name_dep;

            KEYVAL:
            for (key_name in arg_map){
                if (arg_map.hasOwnProperty(key_name)){
                    // 路过key的带'_'依赖值
                    if (key_name.indexOf('_')===0) {continue KEYVAL}
                    // 更新anchor主值
                    anchor_map_revise[key_name] = arg_map[key_name];
                    // 更新anchor依赖值
                    key_name_dep = '_'+key_name;
                    if (arg_map[key_name_dep]){
                        anchor_map_revise[key_name_dep] = arg_map[key_name_dep];
                    }else{
                        delete anchor_map_revise[key_name_dep];
                        delete anchor_map_revise['_s'+key_name_dep];
                    }
                }
            }

            try{
                $.uriAnchor.setAnchor(anchor_map_revise);
            }
            catch(error){
                $.uriAnchor.setAnchor(stateMap.anchor_map,null,true);
            }
            return bool_return;
        }
        // end dom method /changeAnchorPar/
        
        // begin DOM method /toggleChat/
        toggleChat = function(do_extend,callback){
            var
                px_chat_ht = jqueryMap.$chat.height();
                is_open = px_chat_ht === configMap.chat_extended_height;
                is_closed = px_chat_ht === configMap.chat_retract_height;
                is_sliding = ! is_open && ! is_closed;

            if (is_sliding) { return false; }

            if (do_extend){
                jqueryMap.$chat.animate(
                    {height:configMap.chat_extended_height},
                    500,
                    function(){
                        jqueryMap.$chat.attr(
                                'title',configMap.chat_extended_title
                            );
                        stateMap.is_chat_retracted = false;
                        if (callback) { callback(jquery.$chat); }
                    }
                );
                return true;
            }
            jqueryMap.$chat.animate(
                {height:configMap.chat_retract_height},
                500,
                function(){
                    jqueryMap.$chat.attr(
                            'title',configMap.chat_retract_title
                        );
                    stateMap.is_chat_retracted=true;
                    if (callback) { callback(jquery.$chat); }
                }
            );
            return true
        }
        // end DOM method /toggleChat/
    // --END DOM METHODS--
    // -- BEGIN HANDLERS--
        // Begin handler method /onHashChange/
        onHashChange=function(event){
            var
                anchor_map_previous = copyAnchorMap(),
                anchor_map_proposed,
                _s_chat_previous,_s_chat_proposed,
                s_chat_proposed;

            try {anchor_map_proposed = $.uriAnchor.makeAnchorMap();}
            catch(error){
                $.uriAnchor.setAnchor(anchor_map_previous,null,true)
                return false;
            }
            stateMap.anchor_map = anchor_map_proposed;

            _s_chat_previous = anchor_map_previous._s_chat;
            _s_chat_proposed = anchor_map_proposed._s_chat;

            if (! anchor_map_previous || _s_chat_previous !== _s_chat_proposed){
                s_chat_proposed = anchor_map_proposed.chat;
                switch (s_chat_proposed){
                    case 'open':
                        toggleChat(true);
                        break;
                    case 'closed':
                        toggleChat(false);
                        break;
                    default:
                        toggleChat(false);
                        delete anchor_map_proposed.chat;
                        $.uriAnchor.setAnchor(anchor_map_proposed,null,true)
                }
            }
            return false;
        }
        // End handler menthod /onHashChange/
        // Begin handler method /onclickchat/
        onClickChat = function(event){
            changeAnchorPart({
                chat:(stateMap.is_chat_retracted ? 'open' : 'closed')
            });
            return false;
        }
        // End handler method /onclickchat/
    // -- END HANDLERS--
    // --BEGIN PUBLICK METHODS--
        initModule = function($container){
            stateMap.$container = $container;
            $container.html(configMap.main_html);
            setJqueryMap();

            jqueryMap.$chat.click(onClickChat)
            $.uriAnchor.configModule({
                schema_map : configMap.anchor_schema_map
            });
            $(window)
                .bind('hashchange',onHashChange)
                .trigger('hashchange');
            //test toggle
            // setTimeout (function(){ toggleChat(true);},3000);
            // setTimeout (function(){ toggleChat(false);},8000);
        }

        return {initModule:initModule}
    //  --END PUBLICK MEHTODS--

}());
