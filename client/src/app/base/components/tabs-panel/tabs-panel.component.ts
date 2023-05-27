import {ChangeDetectionStrategy, Component, Input} from "@angular/core";
import {createTabsModel, TabsModel} from "../../models/tabs/tabs-model";

@Component({
    selector: "tabs-panel",
    templateUrl: "./tabs-panel.component.html",
    styleUrls: ["./tabs-panel.component.scss"],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TabsPanelComponent {

    @Input()
    public model: TabsModel = createTabsModel();

    public editingId?: number = undefined;

    public editingName = "";

    private lastClicked = 0;

    private clickTimeGap = 500;

    public tabClicked(id: number, initial: string) {
        if (this.model.activate) this.model.activate(id);

        const now = new Date().getTime();
        if (now - this.lastClicked < this.clickTimeGap)
            this.doubleClick(id, initial);
        this.lastClicked = now;
    }

    private doubleClick(id: number, initial: string) {
        if (!this.model.nameChanged) return;
        this.editingId = id;
        this.editingName = initial;
    }

    public completeEdit(id: number) {
        if (this.editingId !== id) return;
        this.model.nameChanged && this.model.nameChanged(this.editingId, this.editingName);
        this.editingId = undefined;
        this.editingName = "";
    }
}
