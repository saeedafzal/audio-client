import { Attributes, Children, ClassComponent, Vnode } from "mithril";

interface DefaultAttributes<M> extends Attributes {
    model?: M;
}

export default abstract class AbstractComponent<M = {}, A extends DefaultAttributes<M> = {}> implements ClassComponent<A> {

    private _model?: M;

    constructor({ attrs }: Vnode<A>) {
        this._model = attrs?.model;
    }

    /*
     * @override
     */
    abstract view(vnode?: Vnode<A>): Children;

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
