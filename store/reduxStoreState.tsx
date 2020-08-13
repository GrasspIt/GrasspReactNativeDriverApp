export interface State {
    form: Form;
    routing: Routing;
    componentState: ComponentState;
    api: Api;
}

interface Form {
    SearchForm?: GeneralForm;
    DSPProductForm?: GeneralForm;
    DSPProductCategoryForm?: GeneralForm;
}

interface GeneralForm {
    syncErrors: any;
    registeredFields: any;
}

interface Routing {
    locationBeforeTransitions: RoutingInfo;
}

interface RoutingInfo {
    pathname: string;
    search: string;
    hash: string;
    action: string;
    key: string;
    query: any;
}

interface ComponentState {
    dsprMenuManagementContainer: DSPRMenuManagementContainer,
    dsprServiceAreaManagementContainer: DSPRServiceAreaManagementContainer,
}

interface DSPRServiceAreaManagementContainer {
    dsprServiceAreas: { [key:number] : DSPRDriverServiceArea},
    dsprServiceAreaVertices: { [key:number]: DSPRDriverServiceAreaVertex}
}
interface DSPRMenuManagementContainer {
    dspProductCategories: { [key: number]: DspProductCategory}
}

interface Api {
    accessToken: string;
    loggedInUserId: string;
    dsprDriverId: string;
    errorMessage: string;
    entities: Entities;
}

interface Entities {
    users: { [key: number]: User };
    unverifiedUsers: { [key: number]: UnverifiedUser };
    searchUsers: { [key: number]: User };
    deliveryServiceProviders: { [key: number]: DeliveryServiceProvider };
    dspManagers: { [key: number]: DspManager };
    DSPRs: { [key: number]: DSPR };
    dsprManagers: { [key: number]: DsprManager };
    dsprDrivers: { [key: number]: DsprDriver };
    dsprDriverLocations: { [key: number]: DsprDriverLocation };
    dsprDriverInventoryPeriods: { [key: number]: DsprDriverInventoryPeriod };
    dsprDriverInventoryItems: { [key: number]: DsprDriverInventoryItem };
    dsprProductInventoryTransactions: any;
    dsprCurrentInventoryItems: { [key: number]: DsprCurrentInventoryItem };
    dsprZipCodes: { [key: number]: DsprZipCode };
    usersIdDocuments: { [key: number]: IdDocument };
    usersMedicalRecommendations: { [key: number]: MedicalRecommendation };
    dsprProductPriceHistories: { [key: number]: DsprProductPriceHistory};
    dspProductCategories: { [key: number]: DspProductCategory };
    coupons: { [key: number]: Coupon };
    orders: { [key: number]: Order };
    addresses: { [key: number]: Address };
    dsprOrderHistories: { [key: number]: DsprOrderHistory };
    textBlasts: any;
    userNotes: any;
    searchProducts: { [key: number]: SearchProduct };
    dspProducts: { [key: number]: DspProduct };
    dsprProductCategoryPromotions: { [key: number]: DsprProductCategoryPromotion};
    dsprDriverServiceAreas: { [key: number]: DSPRDriverServiceArea};
    dsprDriverServiceAreaVertices: { [key: number]: DSPRDriverServiceAreaVertex};
    metrics: { 
        usersMetrics: UsersMetrics
    };
}

export interface User {
    id: number;
    email: string;
    isEmailValidated: boolean;
    firstName: string;
    lastName: string;
    phoneNumber: string;
    birthDate: number;
    isPhoneNumberValidated: boolean;
    signupZipCode: string;
    systemAdministrator: boolean;
    createdTimestamp: string;
    userNotes?: any;
    identificationDocument?: number;
    medicalRecommendation?: number;
    defaultAddress?: Address;
    dsprManagers?: number[];
    deliveryServiceProviderManagers?: number[];
    dsprDrivers?: number[];
    referrerCode?: string;
    hasConvertedBonus?: boolean;
    availableReferrerBonus?: number;
    isFirstTimeUser?: boolean;
    userDSPRDetails?: any[];
}

interface UnverifiedUser extends User {
    medicalRecommendation?: number;
    identificationDocument?: number;
}

interface DeliveryServiceProvider {
    id: number;
    name: string;
    managers: number[];
    products: number[];
    productCategories: number[];
}

interface DspManager {
    id: number;
    deliveryServiceProvider?: number;
    managerUser?: number;
    dspr?: number;
    user?: number;
    shouldNotifyOnOrderStatusChanges?: boolean;
    active: boolean;
}

type MenuMechanism = "closest_driver" | "service_area"
export interface DSPR {
    id: number;
    name: string;
    deliveryServiceProvider: number;
    createdTime?: string;
    minimumOrderSize?: number;
    centralLatitude?: number;
    centralLongitude?: number;
    outstandingOrders?: number[];
    managers?: number[];
    drivers?: number[];
    zipCodes?: number[];
    imageLocation?: string;
    menuMechanism?: MenuMechanism
    dsprAwayMessage?: {
        id: number,
        dsprManager: { id: number },
        message: string,
        current: boolean,
        createdTimestamp: string,
    },
    analytics: {
        days: Analytic[],
        weeks: Analytic[],
        months: Analytic[],
        quarters: Analytic[],
        years: Analytic[]
    }
}

interface Analytic {
    beginDate: string;
    cashReceivedTotal: number
    taxesTotal: number;
    deliveryFeesTotal: number;
    discountsTotal: number;
    productRevenuesTotal: number;
    revenuesTotal: number;
    flowerRevenue: number;
    concentrateRevenue: number;
    edibleRevenue: number;
    vaporizerRevenue: number;
    otherRevenue: number
    numCompletedOrders: number;
    numPlacedOrders: number;
    numFirstTimeCompletedOrders: number;
}

interface DsprManager {
    id: number;
    dspr: number;
    user: number;
    active: boolean;
    shouldNotifyOnOrderStatusChanges?: boolean;
}

export interface DsprDriver {
    id: number;
    user: number;
    dspr: number;
    onCall?: boolean;
    active?: boolean;
    currentLocation?: number;
    queuedOrders?: number[];
    currentInventoryPeriod?: number;
    currentInProcessOrder?: number;
    employeeNumber?: string;
    vehicleDescriptiveName?: string;
    vehicleLicensePlateNumber?: string;
    employeeIDExpirationDate?: number;
}

export interface DsprDriverLocation {
    id: number;
    longitude: number;
    latitude: number;
    current: boolean;
    dsprDriver: number;
    dspr: number;
}

interface DsprDriverInventoryPeriod {
    id: number;
    cashOnHand: number;
    dsprDriverInventoryItems: number[];
    driver?: number;
    dspr?: number;
    current?: boolean;
}

interface DsprDriverInventoryItem {
    id: number;
    product: number;
    quantityInitial: number;
    costOfQuantityInitial: number;
    quantityAvailable: number;
    costOfQuantityAvailable: number;
    quantityInProcess: number;
    costOfQuantityInProcess: number;
    quantitySold: number;
    costOfQuantitySold: number;
    quantityLost: number;
    costOfQuantityLost: number;
    quantityReturned: number;
    costOfQuantityReturned: number;
    inventoryPeriod?: number;
}

interface DsprCurrentInventoryItem {
    id: number;
    dspr: number;
    product: number;
    quantity: number;
    quantityLost: number;
    quantityReturned: number;
    costOfInventory: number;
    costOfLostInventory: number;
    costOfReturnedInventory: number;
}

interface DsprZipCode {
    id: number;
    zipCode: string;
    dspr: number;
    active: boolean;
    minimumOrderSizeOverride?: number;
}

interface DsprProductCategoryPromotion {
    id: number;
    dspr: number;
    productCategory: number;
    promotionalText: string;
    imageFilename: string;
    current: boolean;
}

interface UserDocument {
    id: number;
    idNumber?: string;
    fileName?: string;
    verified?: boolean;
    current?: boolean;
    visible?: boolean;
}

interface IdDocument extends UserDocument {
    birthDate: number;
    expirationDate: number;
}

interface MedicalRecommendation extends UserDocument {
    id: number;
    stateIssued: boolean;
}

interface DsprProductPriceHistory {
    id: number;
    // dspr: number;
    price?: number;
    current: boolean;
    dspr: { id: number };
    eighthPrice?: number;
    quarterPrice?: number;
    halfPrice?: number;
    ozPrice?: number;
}

interface DspProductCategory {
    id: number;
    deliveryServiceProvider: number;
    name: string;
    order: number;
}

type DiscountType = 'absolute' | 'percent';

interface Coupon {
    id: number;
    dspr: number;
    code: string;
    discountAmount: number;
    discountType: DiscountType;
    maxDiscountAmount: number;
    maxPerUserUsageTimes: number;
    totalUsage: number;
    isActive: boolean;
    isFirstTimeUserOnly: boolean;
    lastUpdateDsprManager: { id: number, dspr: { id: number } };
    specificallyAllowedProducts: any[];
    specificallyAllowedProductCategories: number[];
    specificallyAllowedUsers: number[];
    dailyDealDays: any[];
}

export interface Order {
    id: number;
    dsprDriver: number;
    user: number;
    userMedicalRecommendation: number;
    userIdentificationDocument: number;
    address: number;
    orderStatus: string;
    cashTotalPreDiscounts: number;
    discountTotal: number;
    cashTotalPreTaxesAndFees: number;
    taxesTotal: number;
    deliveryFee: number;
    cashTotal: number;
    userFirstTimeOrderWithDSPR: false;
    orderDetails: OrderDetail[];
    orderTaxDetails: OrderTaxDetail[];
    createdTime: string;
    updatedTime: string;
    specialInstructions?: string;
    coupon?: Partial<Coupon>;
    medicalRecommendation?: MedicalRecommendation;
}

interface OrderDetail {
    id: number;
    product: SearchProduct;
    priceHistory: DsprProductPriceHistory;
    quantity: number;
    unit: string;
    pricePreDiscount: number;
    discount: number;
}

interface Address {
    id: number;
    street: string;
    zipCode: string;
    latitude: number;
    longitude: number;
}

interface OrderTaxDetail {
    applicableTaxId: number;
    name: string;
    amount: number;
    rate: number;
}

interface DsprOrderHistory {
    dspr: number;
    orders: number[];
    beginTimestamp: string;
    endTimestamp: string;
}

interface SearchProduct {
    id: number;
    deliveryServiceProvider: { [key: number]: number };
    productCategories: { id: number }[];
    productType: string;
    isFlower: boolean;
    isActive: boolean;
    flowerType: string;
    name: string;
    imageLocation: string;
    description?: string;
    isExcludedFromCoupons: boolean;
    thcPercentage?: number;
    cbdPercentage?: number;
    cbnPercentage?: number;
}

interface DspProduct {
    deliveryServiceProvider: number,
    name: string,
    isActive: boolean,
    isFlower: boolean,
    productType: string,
    imageLocation?: string,
    isExcludedFromCoupons: boolean,
    productCategories: { id: number}[],
    currentPrice: number,
    flowerType: string,
    description: string,
    thcPercentage: string,
    cbdPercentage: string,
    cbnPercentage: string,
    thcMg: string,
    cbdMg: string,
    id: number,
}

interface UsersMetrics {
    metric: string;
    newUsersSinceTimestamp: number;
    totalUsers: number;
}

interface DSPRDriverServiceArea {
    id: number,
    currentDriver: DsprDriver,
    dspr: number,
    active: boolean,
    dsprDriverServiceAreaVertices: number[]
}

interface DSPRDriverServiceAreaVertex {
    id: number,
    latitude: number,
    longitude: number,
    dsprDriverServiceArea?: number,
    dspr?: number,
    vertexOrder: number
}