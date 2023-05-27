import {AppAction} from "../action/app-action";

export interface TabsModel<Id = number> {
    createAction?: AppAction;
    activate?: (id: Id) => void;
    close?: (id: Id) => void;
    nameChanged?: (id: Id, name: string) => void;
    activeTab?: Id;
    tabs: TabModel<Id>[];
}

export interface TabModel<Id = number> {
    id: Id;
    name: string;
    closeable: boolean;
}

export const createTabsModel = (): TabsModel => ({
    tabs: [],
});
