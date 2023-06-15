import {IPublicEnumTransformStage, IPublicModelPluginContext, IPublicTypeRootSchema, IPublicTypeNodeData} from '@alilc/lowcode-types';
import {Button, Message} from '@alifd/next';
import {
  saveSchema,
} from '../../services/mockService';
import {project} from "@alilc/lowcode-engine";
import {traverseTree} from "../../utils";
import {IPublicTypeNodeSchema} from "@alilc/lowcode-types/lib/shell/type/node-schema";

// 导出组件配置
const ExportConfigPlugin = (ctx: IPublicModelPluginContext) => {
  return {
    async init() {
      const { skeleton, config } = ctx;

      const componentsSetterMap = {
        InputSetting: 'StringSetter',
        TextAreaSetting: 'TextAreaSetting',
        NumberInputSetting: 'NumberSetter',
        RadioSetting: 'RadioGroupSetter',
      }

      // 处理数据源
      const getConfigJson = (componentsTree:IPublicTypeRootSchema[]) => {
        const componentsTreeData = componentsTree[0].children


        function traverseFn(item:IPublicTypeNodeSchema & {[key: string]: any}) {
          const {props, children, componentName} = item;
          for (const key in item) {
            delete item[key]
          }
          // 分组容器
          if(componentName === 'GroupContainer') {
            item.name = props.name
            item.title = props.title
            children ? item.children = children : ''
          } else {
            item.setter =  {
              "componentName": componentsSetterMap[componentName],
              "isRequired": true,
              "initialValue": ""
            }
            item.name = props.name
            item.title = props.title
            item.tip = props.tip
            item.description =  props.description
          }
          if(children && children.length) {
            for (const key in children) {
              traverseFn(children[key])
            }
          }
        }

        for (const item of componentsTreeData) {
          traverseFn(item)
        }
        console.log(componentsTreeData);
        Message.success('成功导出组件配置，详见控制台!');
      }

      const exportConfigJson = () => {
        const compConfig = project.exportSchema(IPublicEnumTransformStage.Save);
        getConfigJson(compConfig.componentsTree)
      };
      skeleton.add({
        name: 'ExportConfig',
        area: 'topArea',
        type: 'Widget',
        props: {
          align: 'right',
        },
        content: (
          <Button type="primary" onClick={() => exportConfigJson()}>
            导出组件配置
          </Button>
        ),
      });
    },
  };
}
ExportConfigPlugin.pluginName = 'ExportConfigPlugin';
ExportConfigPlugin.meta = {
  dependencies: ['EditorInitPlugin'],
};
export default ExportConfigPlugin;
