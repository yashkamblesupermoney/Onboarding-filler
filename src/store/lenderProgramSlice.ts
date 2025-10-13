import { createSlice, PayloadAction } from '@reduxjs/toolkit'

// Types
export interface FinancePlan {
    financingPlanId: number
    financingPlanName: string
    description: string
    loanType: string
    delayedDisbursementPeriod: number
    interestFeeTermAfterActivation: number
    tenureType: string
    processingFee: number
    minimumAmount: number
    maximumAmount: number
    penalInterestPerDay: number
    numberOfRepayments: number[]
    repayEvery: number[]
    repayEveryType: string
    nachChequeBounceCharges: number
    loanDocumentCharges: number
    minimumInterestRatePerDay: number
    maximumInterestRatePerDay: number
    minInterestChargeablePeriod: number
    maxInterestChargeablePeriod: number
    loanProductId: number
    firstEmiDate: string[]
    approved: boolean
    createdBy: string
    createdDate: string
    modifiedBy: string | null
    modifiedDate: string | null
}

export interface LendersMapping {
    programId: number
    lenderId: number
    lenderName: string
    mappingId: number
    priority: number
    conductKyc: boolean
    gstRequired: boolean
    fldgProgram: boolean
    fldgPercentage: number
    partnerPercentage: number
    shareholderPercentage: number
    coapplicantRequired: boolean
    propertyOwnerProofRequired: boolean
    fetchBanking: boolean
    fetchGstReport: boolean
    lenderHigherLimit: number
    utilization: number
    creditReview: boolean
    supermoneyCollectFinancial: boolean
    checkHardPullCredit: boolean
    debitcardMandate: boolean
    aadhaarMandate: boolean
    physicalMandate: boolean
    upiMandate: boolean
    invoiceVintage: number
    consentInvoice: boolean
    invoiceUploadRequired: boolean
    registerNACH: boolean
    executeLoanAgreement: boolean
    collectPOD: boolean
    collectPDC: boolean
    requiredCPV: boolean
    applicationForm: string | null
    isPOIPOAPOBSoftcopyRequired: boolean
    psd: boolean
    getFinancePlanRespList: FinancePlan[]
}

export interface Programs {
    programId: number
    programName: string
    description: string
    company: string
    onboardingPartner: string
    productName: string
    isCashbackAvailable: boolean
    holdback: number | null
    approve: boolean
    industry: string | null
    utilization: number
    programApprovedLimit: number
    requestId: string
    createdDate: string
}

// Slice State
interface LPState {
    getProgramsList: Programs[]
    getProgramsLenderMappingList: LendersMapping[]
}

const initialState: LPState = {
    getProgramsList: [],
    getProgramsLenderMappingList: [],
}

// Slice
const LPSlice = createSlice({
    name: 'lp',
    initialState,
    reducers: {
        setProgramsList(state, action: PayloadAction<Programs[]>) {
            state.getProgramsList = action.payload
        },
        setProgramsLenderMappingList(state, action: PayloadAction<LendersMapping[]>) {
            state.getProgramsLenderMappingList = action.payload
        },
        resetLPState() {
            return initialState
        },
    },
})

// Exports
export const {
    setProgramsList,
    setProgramsLenderMappingList,
    resetLPState,
} = LPSlice.actions

export default LPSlice.reducer
