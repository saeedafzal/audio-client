import { Attributes, Children, ClassComponent, Vnode } from "mithril";
import AbstractModel from "./abstractmodel";

export interface DefaultAttributes<M> extends Attributes {
    model?: M;
}

export default abstract class AbstractComponent<M extends AbstractModel = AbstractModel, A extends DefaultAttributes<M> = DefaultAttributes<M>> implements ClassComponent<A> {

    private _model?: M;

    constructor({ attrs }: Vnode<A>) {
        this._model = attrs?.model;
    }

    /**
     * @override
     */
    oncreate(_?: Vnode<A>) {
        this.model?.init();
    }

    /*
     * @override
     */
    abstract view(vnode?: Vnode<A>): Children;

    /**
     * @override
     */
    onremove(): void {
        this.model?.teardown();
    }

    /**
     * Get the model if supplied.
     */
    get model(): M {
        if (!this._model) {
            throw Error("No model supplied for this component.");
        }
        return this._model;
    }
}
