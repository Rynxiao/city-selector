# 城市选择控件

想到做这个，是因为无意中在github上看到了这一个仓库[https://github.com/lunlunshiwo/ChooseCity](https://github.com/lunlunshiwo/ChooseCity)，做的就是一个城市选择控件，是用vue写的，说的是阿里的一道题目，然后想想自己闲着也是闲着，就动手用react又重新做了一遍。

## 运行

运行需知：首先去百度开放云平台申请自己的AK，申请方法见下面的**定位**

```cmd
# dev
npm install
npm start

# deploy
npm run build
npm install http-server -g
http-server ./build -p 38083 -s -P http://www.msece.com
localhost:38083

# test
npm run test
```

## 要求

- 可定位到当前所在城市，可支持传城市
- 下次打开优先选取上次定位城市，如本次定位和上次不一样，则取本地城市，同时展示最近选择的城市，最近选择的城市可配
- 城市列表按字母分组，如B组：北京、包头，同时左侧带A-Z导航符条，点击对应字母定位至对应的组位置，如点击C则定位至C组，同时弹出提示为C
- 支持城市搜索，页头带搜索框，可支持联想功能，注意性能
- 选择对应城市，会将对应城市数据带回给使用页面
- 支持单个页面上同时存在多个城市组件
- 页面用flex布局（css）

## 说明

个人采用的路由形式，因此没有做成一个具体的组件(要组件化也就是把state换成props传值即可)，但是在整个页面中做了很小单元的拆分。另外“上次定位”的功能暂时未完善，容之后补上。

## 技术栈

采用的是react官网提供的脚手架`create-react-app`，因此整体技术是`react`，采用`webpack`进行打包构建，`jest`测试。同时在此基础上新增了一些东西。

### sass

脚手架最开始不支持sass，开启sass需要如下配置：

```cmd
# 安装依赖包
npm install --save node-sass-chokidar
npm install --save npm-run-all

# 脚本中增加build-css与watch-css
# 修改start和build命令，让其可以同时运行多个命令
"scripts": {
+    "build-css": "node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/",
+    "watch-css": "npm run build-css && node-sass-chokidar --include-path ./src --include-path ./node_modules src/ -o src/ --watch --recursive",
     "test": "react-scripts test --env=jsdom",
-    "start": "react-scripts start",
-    "build": "react-scripts build",
+    "start-js": "react-scripts start",
+    "start": "npm-run-all -p watch-css start-js",
+    "build-js": "react-scripts build",
+    "build": "npm-run-all build-css build-js"
}

# .gitignore中去除生成的css文件
src/**/*.css
```

### react-router

```cmd
npm install --save react-router-dom
```

安装依赖之后，增加了一个全局入口，在`src/container/index.js`中，如下：

```javascript
<Switch>
    <Route exact path="/" component={ App } />
    <Route path="/city" component={ City } />
</Switch>
```

增加两个页面，路由分别如上配置。

### 定位

需要定位到当前城市，采用的是百度地图的定位，需要首先去百度地图开放平台上申请一个秘钥，地址在这里[http://lbsyun.baidu.com/apiconsole/key](http://lbsyun.baidu.com/apiconsole/key)，进去之后查看js文档，这里不再赘述，可以自己去了解。

- 在`src/public/index.html`中加入百度开放平台提供的脚本链接，填上自己的秘钥。

```html
<script type="text/javascript" src="http://api.map.baidu.com/api?v=2.0&ak=your_ak"></script>
```

- `src/services/locationServices.js`中加入定位代码

```javascript
async function getLocalCity() {
    return new Promise(resolve => {
        var myCity = new window.BMap.LocalCity();
        myCity.get(result => {
            resolve(result.name);
        });
    }); 
}
```






