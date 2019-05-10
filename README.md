# H5-mint ui

#### 介绍
这是一个封装了axios,router,element.ui,antv/F2(echart)的框架

#### 软件架构
软件架构说明


#### 安装教程

1. npm i  
2. npm run dev
3. npm run build

#### 使用说明
1. 开发过程中需要做好备注<br/>
  一：Api js中，每个接口方法需要备注接口名（后续按情况分拆为业务模块js）<br/>
  二：vue页面文件内，每个方法前面添加备注，注明方法作用
2. src文件介绍<br/>
    --api         &nbsp;&nbsp;&nbsp;    Api接口文档<br/>
    --assets      &nbsp;&nbsp;&nbsp;    本地资源，习惯放本地图片<br/>
    --components  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;    公用组件，习惯放全局共同组件，超越模块复用<br/>
    --config      &nbsp;&nbsp;&nbsp;    放置常用js,其中env.js为管理开发|发布环境的域名管理js<br/>
    --icons      &nbsp;&nbsp;&nbsp;     管理svg资源文件，已用svg-sprint封装，调用规则资源放入改文件，使用下述标签调用<br/>
    &nbsp;&nbsp;&nbsp;<xmp><span class="svg-container"></xmp><br/>
    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<svg-icon icon-class="svg图片名字" /><br/>
    &nbsp;&nbsp;&nbsp;<xmp></span></xmp><br/>
    --page        &nbsp;&nbsp;&nbsp;    所有项目vue页面归属，页面组件|模块组件写入相应模块components<br/>
    --router     &nbsp;&nbsp;&nbsp;     路由配置文件，根据项目可对路由js进行分拆<br/>
    --store      &nbsp;&nbsp;&nbsp;     vuex状态管理文件，<br/>
       &nbsp;&nbsp;&nbsp;index.js 已遍历检索引用mudules里的所有vuex了，若要记录新的store数据请建立新的js,并在getter.js注册<br/>
    --style           公用样式文件表    

3. Api封装<br/>
export const getProductInfo = (productId, cityName) => {<br/>
  &nbsp;&nbsp;&nbsp;return request('POST', '/product/getProductInfo', {<br/>
  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;  productId: productId,<br/>
 &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;   cityName: cityName,<br/>
  &nbsp;&nbsp;&nbsp;}) <br/>
 }<br/>


export const getCatalogs= data => {<br/>
  &nbsp;&nbsp;&nbsp;return request('POST', '/product/getProductInfo', data) //获取商品类型<br/>
};<br/>

4: 修改配置文件需要通知开发相关所有人并获得确认，引用第三方组件

### 约定规则
##### `有意义的`: 不过于具体，也不过于抽象<br/>
#### `简短`: 2 到 3 个单词<br/>
#### `具有可读性`: 以便于沟通交流<br/>

1.页面/路由命名规则<br/>
 > `一`：不准使用index等名字，应该尽量使用页面功能对应英文，<br/>
 >>①、查询列表对应添加List,例：adminList,  （与record区别在于，改列表侧重于带有数据操作功能）<br/>
 >>②、修改功能页面添加Edit，例：adminEdit<br/>
 >>③、增加功能页面添加Add，例：adminAdd<br/>
 >>④、审核功能页面添加Check，例：adminCheck<br/>
 >>⑤、功能对应记录添加Record，例：adminRecord  （数据变动记录，简单功能数据展示）<br/>
 >> ⑥、配置功能页面添加Deploy，例：adminDeploy<br/>
  
  >`二`：若发现想取得页面名字已被占用，添加模块缩写前缀，并用小驼峰命名，<br/>


<br/>2.样式命名规则及使用规则<br/>
 > `一`：该架构下使用less编辑样式<br/>
 >>①、页面内部样式必须用（ scoped ）限定样式作用域，想覆盖UI框架样式可使用继承关系进行覆盖<br/>
 >>②、样式内部几乎不应该存在!important<br/>
 >>③、样式命名应做到信达雅和建议中取舍平衡，避免单字母类型极简命名<br/>
 
 >`二`：样式文件提取<br/>
 >>①、模块内部个人可以自己管理自己的公用样式文件<br/>
 >>②、style文件加下面的公用样式需要修改，统一在一周一次碰面会上提出并由专人修改<br/>

<br/>3.组件抽离概括<br/>
 > `一`：拒绝过度抽象，合理冗余<br/>
 >>①、过多，过深的组件嵌套将极大影响代码维护难度，故不宜在页面中加入三层以上组件嵌套<br/>
 >>①、拆出组件前，请先考虑该模块组件化是否能提升开发效率<br/>

   ![]（https://user-gold-cdn.xitu.io/2019/5/8/16a936dcd6f738b5?imageView2/0/w/1280/h/960/format/webp/ignore-error/1）
#### 参考文档
https://segmentfault.com/a/1190000012472099 详细介绍配置文件--build，--config里面的具体信息
<br/>https://element.eleme.cn/#/zh-CN/component/installation element.ui 的说明api
<br/>https://cn.vuejs.org/v2/api/    vue.js的api


#### 参与贡献




