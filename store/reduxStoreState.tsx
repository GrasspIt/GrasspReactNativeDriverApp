export interface State {
    form: Form;
    routing: Routing;
    componentState: ComponentState;
    api: Api;
}

export interface Form {
    SearchForm?: GeneralForm;
    DSPProductForm?: GeneralForm;
    DSPProductCategoryForm?: GeneralForm;
}

export interface GeneralForm {
    syncErrors: any;
    registeredFields: any;
}

export interface Routing {
    locationBeforeTransitions: RoutingInfo;
}

export interface RoutingInfo {
    pathname: string;
    search: string;
    hash: string;
    action: string;
    key: string;
    query: any;
}

export interface ComponentState {
    dsprMenuManagementContainer: DSPRMenuManagementContainer;
    dsprServiceAreaManagementContainer: DSPRServiceAreaManagementContainer;
}

export interface DSPRServiceAreaManagementContainer {
    dsprServiceAreas: { [key: number]: DSPRDriverServiceArea };
    dsprServiceAreaVertices: { [key: number]: DSPRDriverServiceAreaVertex };
}

export interface DSPRMenuManagementContainer {
    dspProductCategories: { [key: number]: DspProductCategory };
}

export interface Api {
    accessToken: string;
    loggedInUserId: string;
    dsprDriverId: string;
    isLoading: boolean;
    entities: Entities;
}

export interface Entities {
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
    dsprProductPriceHistories: { [key: number]: DsprProductPriceHistory };
    dspProductCategories: { [key: number]: DspProductCategory };
    coupons: { [key: number]: Coupon };
    orders: { [key: number]: Order };
    addresses: { [key: number]: Address };
    dsprOrderHistories: { [key: number]: DsprOrderHistory };
    textBlasts: any;
    userNotes: any;
    searchProducts: { [key: number]: SearchProduct };
    dspProducts: { [key: number]: DspProduct };
    dsprProductCategoryPromotions: {
        [key: number]: DsprProductCategoryPromotion;
    };
    dsprDriverServiceAreas: { [key: number]: DSPRDriverServiceArea };
    dsprDriverServiceAreaVertices: { [key: number]: DSPRDriverServiceAreaVertex };
    dsprDriverRoutes: { [key: number]: Route };
    dsprDriverRouteLegs: { [key: number]: RouteLeg };
    dsprDriverRouteLegDirections: { [key: number]: RouteLegDirection };
    dsprDriverRouteLocations: { [key: number]: RouteLocation };
    dsprDriverRouteMetrics: { [key: number]: RouteMetrics };
    metrics: {
        usersMetrics: UsersMetrics;
    };
    //TODO: consider below:
    //Also - should we keep this nested? Alternatively, we can also have a MetrcTag array (populated only with MetcTag strings) within each OrderDetails object. This could be another way of counting scans.
    //The way it is currently implemented, while nested, allows us to avoid filtering OrderDetails in Orders for a specific OrderDetailId, while still making it easy to get MetrcTags for a specific OrderDetail
    //However, the way it is currently implemented makes it more cumbersome to get MetrcTag data for an entire order
    metrcTagsForOrder: { [orderId: number]: { [orderDetailId: number]: MetrcTag[]} };
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

export interface UnverifiedUser extends User {
    medicalRecommendation?: number;
    identificationDocument?: number;
}

export interface DeliveryServiceProvider {
    id: number;
    name: string;
    managers: number[];
    products: number[];
    productCategories: number[];
}

export interface DspManager {
    id: number;
    deliveryServiceProvider?: number;
    managerUser?: number;
    dspr?: number;
    user?: number;
    shouldNotifyOnOrderStatusChanges?: boolean;
    active: boolean;
}

type MenuMechanism = 'closest_driver' | 'service_area';

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
    menuMechanism?: MenuMechanism;
    numberOrdersPerRoute?: number;
    dsprAwayMessage?: {
        id: number;
        dsprManager: { id: number };
        message: string;
        current: boolean;
        createdTimestamp: string;
    };
    analytics: {
        days: Analytic[];
        weeks: Analytic[];
        months: Analytic[];
        quarters: Analytic[];
        years: Analytic[];
    };
}

export interface Analytic {
    beginDate: string;
    cashReceivedTotal: number;
    taxesTotal: number;
    deliveryFeesTotal: number;
    discountsTotal: number;
    productRevenuesTotal: number;
    revenuesTotal: number;
    flowerRevenue: number;
    concentrateRevenue: number;
    edibleRevenue: number;
    vaporizerRevenue: number;
    otherRevenue: number;
    numCompletedOrders: number;
    numPlacedOrders: number;
    numFirstTimeCompletedOrders: number;
}

export interface DsprManager {
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
    currentRoute: number;
    serviceAreas: number[];
}

export interface DsprDriverLocation {
    id: number;
    longitude: number;
    latitude: number;
    current: boolean;
    dsprDriver: number;
    dspr: number;
}

export interface DsprDriverInventoryPeriod {
    id: number;
    cashOnHand: number;
    dsprDriverInventoryItems: number[];
    driver?: number;
    dspr?: number;
    current?: boolean;
}

export interface DsprDriverInventoryItem {
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

export interface DsprCurrentInventoryItem {
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

export interface DsprZipCode {
    id: number;
    zipCode: string;
    dspr: number;
    active: boolean;
    minimumOrderSizeOverride?: number;
}

export interface DsprProductCategoryPromotion {
    id: number;
    dspr: number;
    productCategory: number;
    promotionalText: string;
    imageFilename: string;
    current: boolean;
}

export interface UserDocument {
    id: number;
    idNumber?: string;
    fileName?: string;
    verified?: boolean;
    current?: boolean;
    visible?: boolean;
}

export interface IdDocument extends UserDocument {
    birthDate: number;
    expirationDate: number;
}

export interface MedicalRecommendation extends UserDocument {
    id: number;
    stateIssued: boolean;
}

export interface DsprProductPriceHistory {
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

export interface DspProductCategory {
    id: number;
    deliveryServiceProvider: number;
    name: string;
    order: number;
}

type DiscountType = 'absolute' | 'percent';

export interface Coupon {
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
    lastUpdateDsprManager: { id: number; dspr: { id: number } };
    specificallyAllowedProducts: any[];
    specificallyAllowedProductCategories: number[];
    specificallyAllowedUsers: number[];
    dailyDealDays: any[];
}

export interface Order {
    id: number;
    dsprDriver: number;
    dspr: number;
    user: number;
    userMedicalRecommendation: number;
    userIdentificationDocument: number;
    address: number;
    couponCodes?: string[];
    orderStatus: string;
    cashTotalPreDiscounts: number;
    discountTotal: number;
    cashTotalPreTaxesAndFees: number;
    taxesTotal: number;
    deliveryFee: number;
    cashTotal: number;
    grossProfit: number;
    grossProfitMargin: number;
    userFirstTimeOrderWithDSPR: boolean;
    orderDetails: OrderDetail[];
    calculatedOrderDetails: CalculatedOrderDetail[];
    orderTaxDetails: OrderTaxDetail[];
    createdTime: string;
    updatedTime: string;
    originalOrderCreatedTime?: string;
    lastStatusChangeTime?: string;
    specialInstructions?: string;
    coupon?: Partial<Coupon>;
    coupons?: Partial<Coupon>[];
    medicalRecommendation?: MedicalRecommendation;
    //TODO: Normalize modifiedOrder and modifiedByManager
    modifiedOrder?: { id: number, dsprDriver: { id: number, currentInProcessOrder: { id: number } }, dspr: { id: 1 } };
    modifiedByManager?: { id: number };
}

export interface CalculatedOrderDetail {
    id: number;
    product: SearchProduct;
    priceHistory: DsprProductPriceHistory;
    quantity: number;
    unit: string;
    pricePreDiscount: number;
    discount: number;
    appliedCoupon: Partial<Coupon>;
}

export interface OrderDetail {
    id: number;
    product: SearchProduct;
    priceHistory: DsprProductPriceHistory;
    quantity: number;
    unit: string;
    pricePreDiscount: number;
    discount: number;
}

export interface CalculatedOrderDetail {
    id: number;
    product: SearchProduct;
    priceHistory: DsprProductPriceHistory;
    quantity: number;
    unit: string;
    pricePreDiscount: number;
    discount: number;
    appliedCoupon: Partial<Coupon>;
}

export interface Address {
    id: number;
    street: string;
    zipCode: string;
    latitude: number;
    longitude: number;
}

export interface OrderTaxDetail {
    applicableTaxId: number;
    name: string;
    amount: number;
    rate: number;
}

export interface DsprOrderHistory {
    dspr: number;
    orders: number[];
    beginTimestamp: string;
    endTimestamp: string;
}

export interface SearchProduct {
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

export interface DspProduct {
    deliveryServiceProvider: number;
    name: string;
    isActive: boolean;
    isFlower: boolean;
    productType: string;
    imageLocation?: string;
    isExcludedFromCoupons: boolean;
    productCategories: { id: number }[];
    currentPrice: number;
    flowerType: string;
    description: string;
    thcPercentage: string;
    cbdPercentage: string;
    cbnPercentage: string;
    thcMg: string;
    cbdMg: string;
    id: number;
}

export interface UsersMetrics {
    metric: string;
    newUsersSinceTimestamp: number;
    totalUsers: number;
}

export interface DSPRDriverServiceArea {
    id: number;
    currentDriver: DsprDriver;
    dspr: number;
    active: boolean;
    dsprDriverServiceAreaVertices: number[];
    numberOrdersPerRoute?: number;
}

export interface DSPRDriverServiceAreaVertex {
    id: number;
    latitude: number;
    longitude: number;
    dsprDriverServiceArea?: number;
    dspr?: number;
    vertexOrder: number;
}

export interface Route {
    id: number;
    active: boolean;
    numberLegs: number;
    legs: number[];
    dsprDriver: number;
    startLocation: number;
    endLocation: number;
    metrics: number;
    initialDriverLocation: number;
    finalOrder: number;
    overviewPolyline: number[];
    polylineContainingCoordinates: number[];
}

export interface RouteLeg {
    id: number;
    legOrder: number;
    routeLegDirections: number[];
    route: number;
    startLocation: number;
    endLocation: number;
    metrics: number;
    order: number;
}

export interface RouteLegDirection {
    id: number;
    htmlDirections: string;
    routeLeg: number;
    startLocation: number;
    endLocation: number;
    metrics: number;
    overviewPolyline: number[];
    polyLineContainingCoordinates: number[];
}

export interface RouteLocation {
    id: number;
    latitude: number;
    longitude: number;
}

export interface RouteMetrics {
    id: number;
    distanceText: string;
    distanceValue: number;
    durationText: string;
    durationValue: number;
}

export type OrderWithAddressAndUser = Omit<Omit<Order, 'address'>, 'user'> & {
    address: Address;
    user: User;
};

//TODO: confirm this has not been changed by backend implementation
export interface MetrcTag {
    metrcTag: string;
    orderId: number;
    orderDetailId: number;
    createdTimestamp: string;
    updatedTimestamp?: string;
}