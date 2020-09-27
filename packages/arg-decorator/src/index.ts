import Uma, { createArgDecorator, IContext, mixin, Result } from '@umajs/core';

import Tips from './Tips';

/**
 * param 装饰器
 */
export const Param = createArgDecorator((ctx: IContext, argKey: string) => ctx.param[argKey]);

/**
 * query 装饰器
 */
export const Query = createArgDecorator((ctx: IContext, argKey: string) => ctx.query[argKey]);

/**
 * body 装饰器
 * @body()  修饰完全body
 * @body('key') 修饰特定单个属性值
 * @body(['key1','key2']) 修饰多个属性，返回一个包含key1,key2属性的对象属性
 */
export const Body = createArgDecorator((ctx: IContext, argKey: string | Array<string>) => {
    console.assert(typeof ctx.request.body !== 'undefined',
        '@Body decorator only can be used by POST RequestMethod , Please make sure you use it correctly.');
    const body = ctx.request.body || {};

    if (typeof argKey === 'string') return body[argKey];

    if (Array.isArray(argKey)) {
        const bodyParms = {};

        argKey.forEach((key) => {
            bodyParms[key] = body[key] || '';
        });

        return bodyParms;
    }

    return body;
});

// 可以通过 argDecorator.config.ts 配置提示
mixin(true, Tips, Uma.config.argDecorator || {});

/**
 * 参数必传
 */
export const Require: (key: string, tip?: string) => Result | any = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];

    if (!val) {
        return Tips.Require.err(key, ctx, tip);
    }

    return val;
});

/**
 * 数字
 */
export const ToNumber: (key: string, tip?: string) => Result | any = createArgDecorator((ctx: IContext, key: string, tip: string) => {
    const val = ctx.query[key];
    const intVal = parseInt(val);

    if (Number.isNaN(intVal)) {
        return Tips.Number.err(key, ctx, tip);
    }

    return intVal;
});
