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

const dataSidebarMenu = [];
const listsSidebarMenu = [];
const formSettingsSidebarMenu = [];

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
                        dataSidebarMenu.push({
                            label: element.title,
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["/forms/data/", element.path],
                        });
                        return dataSidebarMenu;
                    });

                    formSettingsMenu.children.map((element) => {
                        formSettingsSidebarMenu.push({
                            label: element.title,
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["/formSettings/form/", element.path],
                        });
                        return formSettingsSidebarMenu;
                    });
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

                    listsMenu.children.map((element) => {
                        listsSidebarMenu.push({
                            label: element.title,
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["/entity/showData/", element.path],
                        });
                        return dataSidebarMenu;
                    });

                    this.lengthOfChildren = listsMenu.children.length;

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
                    label: "Home",
                    icon: "pi pi-fw pi-home",
                    routerLink: ["/"],
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
                {
                    label: "Data",
                    icon: "pi pi-fw pi-th-large",
                    routerLink: ["/forms/data"],
                    items: dataSidebarMenu,
                },
                {
                    label: "Lists",
                    icon: "pi pi-fw pi-bars",
                    routerLink: ["/entity/showData"],
                    items: listsSidebarMenu,
                },

                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-chart-bar",
                    routerLink: ["/dashboard"],
                    roles: [
                        "ROLE_SUPER_ADMIN",
                        "ROLE_ADMIN",
                        "ROLE_STAFF_DATA_MANAGER",
                        "ROLE_STAFF_DATA_VIEWER",
                    ],
                },

                {
                    label: "Archive",
                    icon: "pi pi-fw pi-folder",
                    routerLink: ["/archive"],
                    roles: [
                        "ROLE_SUPER_ADMIN",
                        "ROLE_ADMIN",
                        "ROLE_STAFF_DATA_MANAGER",
                        "ROLE_STAFF_DATA_VIEWER",
                    ],
                },

                {
                    label: "Admin",
                    icon: "pi pi-fw pi-user",
                    routerLink: ["/data"],
                    roles: [
                        "ROLE_SUPER_ADMIN",
                        "ROLE_ADMIN",
                        "ROLE_STAFF_DATA_MANAGER",
                        "ROLE_STAFF_DATA_VIEWER",
                        "ROLE_PARTNER_DATA_MANAGER",
                        "ROLE_PARTNER_DATA_VIEWER",
                        "ROLE_PROGRAM_OFFICER",
                    ],
                    items: [
                        {
                            label: "Tags",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["tags"],
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
                            label: "Task List",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["taskList"],
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },

                        {
                            label: "Work Plan",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["partnerSetupList"],
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },

                        {
                            label: "Partner",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["programPartner"],
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },

                        {
                            label: "Users",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["mis-users"],
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },

                        {
                            label: "Analytics",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["issdugdata.net:3000"],
                            roles: [
                                "ROLE_SUPER_ADMIN",
                                "ROLE_ADMIN",
                                "ROLE_STAFF_DATA_MANAGER",
                                "ROLE_STAFF_DATA_VIEWER",
                            ],
                        },

                        {
                            label: "Grant Process",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["grant-process"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_PROGRAM_OFFICER"],
                            items: [
                                {
                                    label: "Short Term",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["submitletterofinterest"],
                                    roles: ["ROLE_SUPER_ADMIN"],
                                },
                                {
                                    label: "Long Term Grant Application",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["longTermGrantApplication"],
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
                    label: "Set-Up",
                    icon: "pi pi-fw pi-cog",
                    routerLink: ["/set-up"],
                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                    items: [
                        {
                            label: "Program",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["submitletterofinterest"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            items: [
                                {
                                    label: "Add Program",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["program"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    label: "Add Program Category",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["programCategory"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                            ],
                        },

                        {
                            label: "Project Milestones",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["milestones"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                    ],
                },

                {
                    label: "Configuration",
                    icon: "pi pi-fw pi-filter",
                    routerLink: ["/formSettings/form"],
                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                    items: [
                        {
                            label: "Forms",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["forms"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                        {
                            label: "Form Settings",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["/formSettings/form"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            items: formSettingsSidebarMenu,
                        },

                        {
                            label: "Entities",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["/entities"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                            items: [
                                {
                                    label: "Entities",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["entity"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    label: "Entity Views",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["entityView"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    label: "Entity View Filters",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["entityViewFilter"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                                {
                                    label: "Data View",
                                    icon: "pi pi-fw pi-arrow-right",
                                    routerLink: ["dataView"],
                                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                                },
                            ],
                        },

                        {
                            label: "Tag Type",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["tagType"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },

                        {
                            label: "Scheduled Tasks",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["scheduledTasks"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                    ],
                },

                {
                    label: "User",
                    icon: "pi pi-fw pi-arrow-right",
                    routerLink: ["user"],
                    roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                    items: [
                        {
                            label: "Groups",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["groups"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                        {
                            label: "Roles",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["roles"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                        {
                            label: "User Management",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["users"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                        {
                            label: "Access Control Lists",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["acl-group-mapping-lists"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                        {
                            label: "Request Maps",
                            icon: "pi pi-fw pi-arrow-right",
                            routerLink: ["requestMaps"],
                            roles: ["ROLE_SUPER_ADMIN", "ROLE_ADMIN"],
                        },
                    ],
                },
            ];
        }
    }
}
