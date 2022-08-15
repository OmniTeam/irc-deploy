import { Component, OnInit } from "@angular/core";
import { AppMainComponent } from "./app.main.component";
import { AuthService } from "./services/auth.service";
import { Router } from "@angular/router";
import { FormService } from "./services/form.service";
import { ReplacePipe } from "./pipes/replace-pipe";
import { TitleCasePipe } from "@angular/common";
import { forEach } from "jszip";
import { EntityService } from "./services/entity.service";
import { Roles } from "./models/roles";

const misc: any = {
    sidebar_mini_active: true,
};

const dataMenu = [];

const formsMenu: any = {
    path: "forms/data",
    title: "Data",
    type: "sub",
    icontype: "ni-single-copy-04",
    isCollapsed: true,
    roles: [
        "ROLE_SUPER_ADMIN",
        "ROLE_ADMIN",
        "ROLE_PARTNER_DATA_MANAGER",
        "ROLE_PARTNER_DATA_VIEWER",
        "ROLE_STAFF_DATA_MANAGER",
        "ROLE_STAFF_DATA_VIEWER",
    ],
    children: [],
};

const listsMenu: any = {
    path: "entity/showData/",
    title: "Lists",
    type: "sub",
    icontype: "fas fa-list-alt",
    isCollapsed: true,
    children: [],
    roles: [
        "ROLE_SUPER_ADMIN",
        "ROLE_ADMIN",
        "ROLE_PARTNER_DATA_MANAGER",
        "ROLE_PARTNER_DATA_VIEWER",
        "ROLE_STAFF_DATA_MANAGER",
        "ROLE_STAFF_DATA_VIEWER",
    ],
};

const formSettingsMenu: any = {
    path: "formSettings/form",
    title: "Form Settings",
    type: "sub",
    isCollapsed: true,
    roles: ["ROLE_SUPER_ADMIN"],
    children: [],
};

export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    isCollapsed?: boolean;
    isCollapsing?: any;
    children?: ChildrenItems[];
    roles?: any;
}

export interface ChildrenItems {
    path: string;
    title: string;
    type?: string;
    collapse?: string;
    children?: ChildrenItems2[];
    isCollapsed?: boolean;
    roles?: any;
}

export interface ChildrenItems2 {
    path?: string;
    title?: string;
    type?: string;
    roles?: any;
}

// Menu Items
export const ROUTES: RouteInfo[] = [];

@Component({
    selector: "app-menu",
    template: `
        <ul class="layout-menu">
            <li
                app-menuitem
                *ngFor="let item of model; let i = index"
                [item]="item"
                [index]="i"
                [root]="true"
            ></li>
        </ul>
    `,
    providers: [TitleCasePipe],
})
export class AppMenuComponent implements OnInit {
    model: any[];
    public menuItems: any[];
    public isCollapsed = true;
    usersRoles: any;
    my_routes = [];
    private lengthOfChildren: number;
    childrenArray: any;
    formDataLinks: any;

    constructor(
        private router: Router,
        private formService: FormService,
        public app: AppMainComponent,
        public authService: AuthService,
        private entityService: EntityService,
        private titleCasePipe: TitleCasePipe
    ) {}

    ngOnInit() {
        this.usersRoles = this.authService.getUserRoles();

        this.router.events.subscribe((event) => {
            this.isCollapsed = true;
        });
        // console.log(this.authService.isLoggedIn());
        if (this.authService.isLoggedIn()) {
            this.formService.getEnabledForms().subscribe(
                (data) => {
                    for (const form of data) {
                        const formObject = {};
                        const formSettingObject = {};
                        formObject["title"] = this.titleCasePipe.transform(
                            new ReplacePipe().transform(
                                form.displayName,
                                "_",
                                " "
                            )
                        );
                        formObject["path"] = form.name.toString();
                        formObject["type"] = "link";
                        formObject["roles"] = this.usersRoles;

                        formsMenu.children.push(formObject);

                        formSettingObject["title"] =
                            this.titleCasePipe.transform(
                                new ReplacePipe().transform(
                                    form.displayName,
                                    "_",
                                    " "
                                )
                            );
                        formSettingObject["path"] = form.name.toString();
                        formSettingObject["type"] = "link";
                        formSettingObject["roles"] = [
                            "ROLE_SUPER_ADMIN",
                            "ROLE_ADMIN",
                        ];
                        formSettingsMenu.children.push(formSettingObject);
                    }

                    formsMenu.children.map((element) => {
                        dataMenu.push({
                            label: element.title,
                            icon: element.icontype,
                            routerLink: ["/forms/data", element.path],
                        });
                        return dataMenu;
                    });
                    console.log("formsMenu::", formsMenu);
                    console.log("formsMenu Children:::", formsMenu.children);
                    console.log(
                        "formsMenu Children prop:::",
                        formsMenu.children[0]
                    );
                },
                (error) => console.log(error)
            );

            this.entityService.getEntities().subscribe(
                (data) => {
                    for (const entity of data) {
                        const entityObject = {};
                        entityObject["title"] = this.titleCasePipe.transform(
                            new ReplacePipe().transform(entity.name, "_", " ")
                        );
                        entityObject["path"] = entity.id;
                        entityObject["type"] = "link";
                        entityObject["roles"] = this.usersRoles;

                        listsMenu.children.push(entityObject);
                    }

                    this.lengthOfChildren = listsMenu.children.length;
                    this.my_routes.push(
                        {
                            path: "home",
                            title: "Home",
                            type: "link",
                            icontype: "fas fa-home",
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_PARTNER_DATA_MANAGER",
                                "ROLE_PARTNER_DATA_VIEWER",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                                "ROLE_APPLICANT",
                            ],
                        },
                        formsMenu,
                        {
                            path: "dashboard",
                            title: "Dashboard",
                            type: "link",
                            icontype: "fas fa-chart-bar",
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },
                        {
                            path: "archive",
                            title: "Archive",
                            type: "link",
                            icontype: "fas fa-tasks",
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },
                        {
                            path: "/",
                            title: "Admin",
                            type: "sub",
                            icontype: "fas fa-user-cog",
                            isCollapsed: true,
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                                "ROLE_PARTNER_DATA_MANAGER",
                                "ROLE_PARTNER_DATA_VIEWER",
                                "ROLE_PROGRAM_OFFICER",
                            ],
                            children: [
                                {
                                    path: "tags",
                                    title: "Tags",
                                    type: "link",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                        "ROLE_PARTNER_DATA_MANAGER",
                                        "ROLE_PARTNER_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "taskList",
                                    title: "Task List",
                                    type: "link",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "partnerSetupList",
                                    title: "Work Plan",
                                    type: "link",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "programPartner",
                                    title: "Partner",
                                    type: "link",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "mis-users",
                                    title: "Users",
                                    type: "link",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "issdugdata.net:3000",
                                    title: "Analytics",
                                    type: "analytics",
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_ADMIN",
                                        "ROLE_STAFF_DATA_MANAGER",
                                        "ROLE_STAFF_DATA_VIEWER",
                                    ],
                                },
                                {
                                    path: "",
                                    title: "Grant Process",
                                    type: "sub",
                                    isCollapsed: true,
                                    roles: [
                                        "ROLE_SUPER_ADMIN",
                                        "ROLE_PROGRAM_OFFICER",
                                    ],
                                    children: [
                                        {
                                            path: "submitletterofinterest",
                                            title: "Short Term",
                                            type: "link",
                                            roles: ["ROLE_SUPER_ADMIN"],
                                        },
                                        {
                                            path: "longTermGrantApplication",
                                            title: "Long Term Grant Application",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_PROGRAM_OFFICER",
                                            ],
                                        },
                                    ],
                                },
                            ],
                        },

                        {
                            path: "/",
                            title: "Set-Up",
                            type: "sub",
                            icontype: "fas fa-cog",
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            isCollapsed: true,
                            children: [
                                {
                                    path: "",
                                    title: "Program",
                                    type: "sub",
                                    isCollapsed: true,
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                    children: [
                                        {
                                            path: "program",
                                            title: "Add Program",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                        {
                                            path: "programCategory",
                                            title: "Add Program Category",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                    ],
                                },
                                {
                                    path: "milestones",
                                    title: "Project Milestones",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                            ],
                        },

                        {
                            path: "/",
                            title: "Configuration",
                            type: "sub",
                            icontype: "fas fa-tools",
                            isCollapsed: true,
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            children: [
                                {
                                    path: "forms",
                                    title: "Forms",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                formSettingsMenu,
                                {
                                    path: "",
                                    title: "Entities",
                                    type: "sub",
                                    isCollapsed: true,
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                    children: [
                                        {
                                            path: "entity",
                                            title: "Entities",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                        {
                                            path: "entityView",
                                            title: "Entity Views",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                        {
                                            path: "entityViewFilter",
                                            title: "Entity View Filters",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                        {
                                            path: "dataView",
                                            title: "Data View",
                                            type: "link",
                                            roles: [
                                                "ROLE_SUPER_ADMIN",
                                                "ROLE_ADMIN",
                                            ],
                                        },
                                    ],
                                },
                                {
                                    path: "tagType",
                                    title: "Tag Type",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    path: "scheduledTasks",
                                    title: "Scheduled Tasks",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                            ],
                        },
                        {
                            path: "",
                            title: "User",
                            type: "sub",
                            icontype: "fas fa-user-tie",
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            isCollapsed: true,
                            children: [
                                // {path: 'acl-group-mapping', title: 'ACL Group Permissions', type: 'link', roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"]},
                                {
                                    path: "groups",
                                    title: "Groups",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    path: "roles",
                                    title: "Roles",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    path: "users",
                                    title: "User Management",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    path: "acl-group-mapping-lists",
                                    title: "Access Control Lists",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    path: "requestMaps",
                                    title: "Request Maps",
                                    type: "link",
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                            ],
                        }
                    );

                    if (this.lengthOfChildren > 0) {
                        this.my_routes.splice(2, 0, listsMenu);
                    }

                    this.menuItems = this.my_routes.filter(
                        (menuItem) => menuItem
                    );
                },
                (error) => console.log(error)
            );

            this.model = [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-home",
                    routerLink: ["/"],
                },
                {
                    label: "Data",
                    icon: "pi pi-fw pi-bars",
                    routerLink: ["/uikit"],
                    items: dataMenu,
                },
                {
                    label: "UI Kit",
                    icon: "pi pi-fw pi-star-fill",
                    routerLink: ["/uikit"],
                    items: [
                        {
                            label: "Form Layout",
                            icon: "pi pi-fw pi-id-card",
                            routerLink: ["/uikit/formlayout"],
                        },
                        {
                            label: "Input",
                            icon: "pi pi-fw pi-check-square",
                            routerLink: ["/uikit/input"],
                        },
                        {
                            label: "Float Label",
                            icon: "pi pi-fw pi-bookmark",
                            routerLink: ["/uikit/floatlabel"],
                        },
                        {
                            label: "Invalid State",
                            icon: "pi pi-fw pi-exclamation-circle",
                            routerLink: ["/uikit/invalidstate"],
                        },
                        {
                            label: "Button",
                            icon: "pi pi-fw pi-mobile",
                            routerLink: ["/uikit/button"],
                            class: "rotated-icon",
                        },
                        {
                            label: "Table",
                            icon: "pi pi-fw pi-table",
                            routerLink: ["/uikit/table"],
                        },
                        {
                            label: "List",
                            icon: "pi pi-fw pi-list",
                            routerLink: ["/uikit/list"],
                        },
                        {
                            label: "Tree",
                            icon: "pi pi-fw pi-share-alt",
                            routerLink: ["/uikit/tree"],
                        },
                        {
                            label: "Panel",
                            icon: "pi pi-fw pi-tablet",
                            routerLink: ["/uikit/panel"],
                        },
                        {
                            label: "Overlay",
                            icon: "pi pi-fw pi-clone",
                            routerLink: ["/uikit/overlay"],
                        },
                        {
                            label: "Media",
                            icon: "pi pi-fw pi-image",
                            routerLink: ["/uikit/media"],
                        },
                        {
                            label: "Menu",
                            icon: "pi pi-fw pi-bars",
                            routerLink: ["/uikit/menu"],
                            preventExact: true,
                        },
                        {
                            label: "Message",
                            icon: "pi pi-fw pi-comment",
                            routerLink: ["/uikit/message"],
                        },
                        {
                            label: "File",
                            icon: "pi pi-fw pi-file",
                            routerLink: ["/uikit/file"],
                        },
                        {
                            label: "Chart",
                            icon: "pi pi-fw pi-chart-bar",
                            routerLink: ["/uikit/charts"],
                        },
                        {
                            label: "Misc",
                            icon: "pi pi-fw pi-circle-off",
                            routerLink: ["/uikit/misc"],
                        },
                    ],
                },
                {
                    label: "Prime Blocks",
                    icon: "pi pi-fw pi-prime",
                    routerLink: ["/blocks"],
                    items: [
                        {
                            label: "Free Blocks",
                            icon: "pi pi-fw pi-eye",
                            routerLink: ["/blocks"],
                        },
                        {
                            label: "All Blocks",
                            icon: "pi pi-fw pi-globe",
                            url: ["https://www.primefaces.org/primeblocks-ng"],
                            target: "_blank",
                        },
                    ],
                },
                {
                    label: "Utilities",
                    icon: "pi pi-fw pi-compass",
                    routerLink: ["/utilities"],
                    items: [
                        {
                            label: "PrimeIcons",
                            icon: "pi pi-fw pi-prime",
                            routerLink: ["utilities/icons"],
                        },
                        {
                            label: "PrimeFlex",
                            icon: "pi pi-fw pi-desktop",
                            url: ["https://www.primefaces.org/primeflex/"],
                            target: "_blank",
                        },
                    ],
                },
                {
                    label: "Pages",
                    icon: "pi pi-fw pi-briefcase",
                    routerLink: ["/pages"],
                    items: [
                        {
                            label: "Crud",
                            icon: "pi pi-fw pi-pencil",
                            routerLink: ["/pages/crud"],
                        },
                        {
                            label: "Calendar",
                            icon: "pi pi-fw pi-calendar-plus",
                            routerLink: ["/pages/calendar"],
                        },
                        {
                            label: "Timeline",
                            icon: "pi pi-fw pi-calendar",
                            routerLink: ["/pages/timeline"],
                        },
                        {
                            label: "Landing",
                            icon: "pi pi-fw pi-globe",
                            url: "assets/pages/landing.html",
                            target: "_blank",
                        },
                        {
                            label: "Login",
                            icon: "pi pi-fw pi-sign-in",
                            routerLink: ["/login"],
                        },
                        {
                            label: "Invoice",
                            icon: "pi pi-fw pi-dollar",
                            routerLink: ["/pages/invoice"],
                        },
                        {
                            label: "Help",
                            icon: "pi pi-fw pi-question-circle",
                            routerLink: ["/pages/help"],
                        },
                        {
                            label: "Error",
                            icon: "pi pi-fw pi-times-circle",
                            routerLink: ["/error"],
                        },
                        {
                            label: "Not Found",
                            icon: "pi pi-fw pi-exclamation-circle",
                            routerLink: ["/notfound"],
                        },
                        {
                            label: "Access Denied",
                            icon: "pi pi-fw pi-lock",
                            routerLink: ["/access"],
                        },
                        {
                            label: "Empty",
                            icon: "pi pi-fw pi-circle-off",
                            routerLink: ["/pages/empty"],
                        },
                    ],
                },
                {
                    label: "Hierarchy",
                    icon: "pi pi-fw pi-align-left",
                    items: [
                        {
                            label: "Submenu 1",
                            icon: "pi pi-fw pi-align-left",
                            items: [
                                {
                                    label: "Submenu 1.1",
                                    icon: "pi pi-fw pi-align-left",
                                    items: [
                                        {
                                            label: "Submenu 1.1.1",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                        {
                                            label: "Submenu 1.1.2",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                        {
                                            label: "Submenu 1.1.3",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                    ],
                                },
                                {
                                    label: "Submenu 1.2",
                                    icon: "pi pi-fw pi-align-left",
                                    items: [
                                        {
                                            label: "Submenu 1.2.1",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            label: "Submenu 2",
                            icon: "pi pi-fw pi-align-left",
                            items: [
                                {
                                    label: "Submenu 2.1",
                                    icon: "pi pi-fw pi-align-left",
                                    items: [
                                        {
                                            label: "Submenu 2.1.1",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                        {
                                            label: "Submenu 2.1.2",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                    ],
                                },
                                {
                                    label: "Submenu 2.2",
                                    icon: "pi pi-fw pi-align-left",
                                    items: [
                                        {
                                            label: "Submenu 2.2.1",
                                            icon: "pi pi-fw pi-align-left",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                },
                {
                    label: "Buy Now",
                    icon: "pi pi-fw pi-shopping-cart",
                    url: ["https://www.primefaces.org/store"],
                },
                {
                    label: "Documentation",
                    icon: "pi pi-fw pi-info-circle",
                    routerLink: ["/documentation"],
                },
            ];
        }
    }
}
