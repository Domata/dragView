/**
 * @author chaohui jiang
 * @version:v1.1.0
 */
(function (nameSpace) {
    nameSpace.components =  nameSpace.components || {};
    var COMPONENTS_TYPE = nameSpace.sources.COMPONENTS_TYPE;
    var injection = nameSpace.components.injection;
    var getColor = nameSpace.utils.getColor;
    var getKey = nameSpace.utils.getKey;
    var createNativeElement = nameSpace.utils.createNativeElement;
    var createTool = nameSpace.utils.createTool;
    var event = nameSpace.event;
    var Minx = nameSpace.utils.Minx;
    var canConfig = nameSpace.func.canConfig;
    function Layout(config) {
        config = config || {};
        this._currentElement = config.element;
        this._componentMap = config.componentMap;
        this._renderClazz = null;
        this._dom = null;
        this._toolsDom = null;
    }
    Layout.addComponent = function (componentMap,configs,srcKey,targetKey,itemKey) {
        var rootKey = targetKey;
        var keys = {};
        var key;
        configs.element.forEach(function (item) {
            key = getKey();
            var configs = item.configs;
           keys[configs.element.key] = getKey();
        });
        configs.element.forEach(function (item) {
            item.sortNumber = 1;
            item.componentMap = componentMap;
            item.configs.element.key = keys[item.configs.element.key];
            item.configs.element.parentKey = item.configs.element.parentKey==null?rootKey:keys[item.configs.element.parentKey];
            //item.configs.element.bgColor = getColor(isShowBgColor);//随机color
            item.configs.element.put = false;
            item.configs.element.rootKey = rootKey;
            if(item.configs.element.parentKey === rootKey){
                componentMap.addComponent(COMPONENTS_TYPE.LAYOUT,item.configs);
            }else{
                componentMap.addComponent(COMPONENTS_TYPE.CONTENT,item.configs);

            }
        });
    };
    Layout.prototype={
        constructor:Layout,
        getCurrentElement:function () {
          return this._currentElement;
        },
        getCurrentDom:function () {
            return  this._dom;
        },
        getContainer:function () {
          return this._contentDom;
        },
        //选中
        select:function () {
            var self = this;
            this._renderClazz._setSelectComponent(this);
            var callBacks = event.getCallBacks(COMPONENTS_TYPE.LAYOUT,"select");
            callBacks.forEach(function (callBack) {
                callBack.call(self);
            });
        },
        unSelect:function () {
            this._toolsDom.innerHTML = "";
        },
        _addTools:function () {
            var self = this;
            var deleteDom = createTool.call(self,'delete');
            var crossDom = createTool.call(self,'crossMove');
            this._toolsDom.innerHTML = "";
            this._toolsDom.appendChild(crossDom);
            this._toolsDom.appendChild(deleteDom);
        },
        render:function (renderClazz,isPreview) {
            var self = this;
            this._renderClazz = renderClazz;
            var styles = {
                position:"relative",
                float:"left",
                width:"100%",
                height:"100%",
            }
            if(this._currentElement.background){
                styles.background = this._currentElement.background;
            }
            var _dom = createNativeElement("div",{
                styles:styles,
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                }
            });
            var _contentDom =  createNativeElement("div",{
                styles:{
                    position:"relative",
                    width:"100%",
                    height:"100%",
                },
                attrs:{
                    "data-key":this._currentElement.key,
                    "data-parentKey":this._currentElement.parentKey,
                    "data-dropComponent":this._currentElement.dropComponent,
                    class:this._renderClazz._getSelectComponentKey()===this._currentElement.key?"yt-dataView-select":""
                }
            });

            if(isPreview){
                _dom.onclick=function (e) {
                    self.select();
                    window.event? window.event.cancelBubble = true : e.stopPropagation();
                }
                this._toolsDom =  createNativeElement("div",{
                    styles:{
                        position:"relative",
                        // overflow:"hidden"
                    }
                });

                _contentDom.appendChild( this._toolsDom);
                if(this._renderClazz._getSelectComponentKey()===this._currentElement.key){
                    this._addTools();
                }
            }
            _dom.appendChild(_contentDom);
            this._contentDom = _contentDom;
            this._dom = _dom;
            return _dom;
        }
    }
    Minx(Layout.prototype,canConfig());
    injection.register(COMPONENTS_TYPE.LAYOUT,Layout);
    nameSpace.components.Layout = Layout;
})(window.YT.DataView);