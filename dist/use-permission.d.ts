type PermissionMap = Record<string, string | boolean | null>;
interface DirectiveBinding {
    value: any;
    oldValue: any;
}
interface UnwatchFunction {
    (): void;
}
interface watchCallbackFunction {
    (newValue: any, oldValue: any): void;
}
/**
 * 使用权限控制
 * @param {PermissionMap} initPermissionMap - 初始权限映射
 * @returns {Object} - 包含组件、指令、设置权限、判断权限和监听权限的方法
 */
declare function usePermission(initPermissionMap: PermissionMap): {
    component: {
        name: string;
        functional: boolean;
        props: {
            name: {
                type: (ArrayConstructor | StringConstructor)[];
                default: () => never[];
            };
        };
        render: (h: Function, { props, slots }: {
            props: {
                name: string | string[];
            };
            slots: Function;
        }) => any;
    };
    directive: {
        bind(el: HTMLElement, { value }: DirectiveBinding): void;
        update(el: HTMLElement, { value, oldValue }: DirectiveBinding): void;
    };
    setPermission: (key: string | PermissionMap, value?: string | boolean | null) => void;
    hasPermission: (key: string) => boolean;
    watchPermission: (key: string, cb: watchCallbackFunction) => UnwatchFunction;
};

export { usePermission as default };
