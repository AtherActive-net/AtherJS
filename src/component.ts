import { Store } from "./Store.js";

export class ComponentFunctions {
    private componentClassCache: Map<string, Component>;

    constructor() {
        this.componentClassCache = new Map();
    }

    public getComponent(activeScript:Element) {
        const uuid = activeScript.getAttribute('at-component-uuid');
        const component = document.querySelector(`[at-component-uuid="${uuid}"]`)

        if(component == undefined) {
            throw new Error(`Could not find component with uuid ${uuid}`);
        }
        if(this.componentClassCache.has(uuid)) {
            return this.componentClassCache.get(uuid);
        } else {
            const componentClass = new Component(component);
            this.componentClassCache.set(uuid, componentClass);
            return componentClass;
        }
    }

    /**
     * Internal use only. Only works IF the component is already cached.
     * @param string uuid UUID of the component
     */
    public getComponentByUUID(uuid:string) {
        if(this.componentClassCache.has(uuid)) {
            return this.componentClassCache.get(uuid);
        } else {
            throw new Error(`Could not find component with uuid ${uuid}`);
        }
    }
}

export class Component {
    public uuid:string;
    public element:Element;
    public name:string;

    private store:Store

    constructor(componentElement:Element) {
        this.element = componentElement;
        this.uuid = componentElement.getAttribute('at-component-uuid');
        this.name = componentElement.getAttribute('at-component');
    }

    public getStore() {
        if(!this.store)
        this.store = new Store(window['ather'],{prefix: this.uuid});

        return this.store;
    }


}


export const componentFunctions =  new ComponentFunctions();