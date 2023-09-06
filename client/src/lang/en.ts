import { getLang } from './index';
import { timeDurationFormatter } from '@/utils/formatter';

const messages = {
    lang: getLang(),
    form: {
        cancel: 'Cancel',
        submit: 'Submit',
        save: 'Save',
        rename: 'Rename',
        edit: 'Edit',
        delete: 'Delete',
        requireInput: ({ named }: { named: (prop: string) => any }) =>
            `Please enter ${named('prop')}`,
        requireSelect: ({ named }: { named: (prop: string) => any }) =>
            `Please select ${named('prop')}`,
        charLengthOverflow: ({ named }: { named: (prop: string) => any }) =>
            `Please enter within ${named('max')} characters`,
    },
    msg: {
        networkError: 'Network error',
        unknownError: 'Unknown error',
        uploadFileSizeOverflow: ({ named }: { named: (prop: string) => any }) =>
            `File must not exceed ${named('size')}`,
        uploadFileFormatNotSupported: 'The file format is not supported',
        uploadFileSuccessWithName: ({ named }: { named: (prop: string) => any }) =>
            `Upload file ${named('name')} successful`,
        uploadFolderSuccessWithName: ({ named }: { named: (prop: string) => any }) =>
            `Upload folder ${named('name')} successful`,
    },
    time: {
        second: 'second',
        minute: 'minute',
        hour: 'hour',
        day: 'day',
    },
    errorCode: {
        11001: 'Invalid authentication information',
        11002: 'Expired authentication information',
        11003: 'Account is empty',
        11004: 'Please log in first',
        11005: 'Wrong user name or password',
        11006: 'Insufficient permissions',
        12001: 'Failed to connect to FTP server',
        12002: 'FTP server failed to create file',
        13001: 'Parameter verification failed',
        21001: 'Add model failed',
        22001: 'Delete model failed',
        23001: 'Update model failed',
        24001: 'Search model failed',
        24002: 'Model not found',
    },
    menu: {
        note: 'Note',
        '3d': '3D',
    },
    user: {
        login: 'Log in',
        logout: 'Log out',
        logoutConfirm:
            'Are you sure you want to log out? Currently uncommitted changes may be lost',
        inputUserIdOrUserName: 'Please enter user ID or username',
        account: 'Account',
        password: 'Password',
        loginFailed: 'Login failed',
    },
    note: {
        searchProject: 'Search project',
        addProject: 'Add project',
        editProject: 'Edit project',
        projectName: 'Project name',
        owners: 'Owners',
        selectAtLeastOneOwner: 'Please select at least one owner',
        openness: 'Openness',
        opennessHelpText: `Fully public: all users including anonymous users can read.
Half public: only readers and owners can read.
Private: only owner can read.`,
        FULL_PUBLIC: 'Fully public',
        HALF_PUBLIC: 'Half public',
        PRIVATE: 'Private',
        readers: 'Readers',
        createUsername: 'Create user name',
        createTime: 'Create time',
        confirmToDelete: 'Confirm to delete?',
        deleteProjectConfirm: ({ named }: { named: (prop: string) => any }) =>
            `If you are sure to delete, please enter the project name "${named('projectName')}".`,
        projectNameError: 'Please enter a correct project name',
        saveState: ({ named }: { named: (prop: string) => any }) => {
            const { unit, value } = timeDurationFormatter(named('time'));
            const timeStr =
                value + ' ' + (unit && messages.time[unit] + (value && value > 1 ? 's' : '')) ?? '';
            return named('state')
                ? `Saved successfully ${timeStr} ago`
                : `Failed to save ${timeStr} ago`;
        },
        editMode: 'Edit mode',
        readMode: 'Read mode',
        files: 'Files',
        addFile: 'Add file',
        addFolder: 'Add folder',
        deleteFile: 'Delete file',
        deleteFolder: 'Delete folder',
        deleteFileConfirm: ({ named }: { named: (prop: string) => any }) =>
            `Are you sure to delete file ${named('name')} ?`,
        deleteFolderConfirm: ({ named }: { named: (prop: string) => any }) =>
            `Are you sure you want to delete the folder ${named('name')} and all its contents?`,
        uploadFile: 'Upload file',
        uploadFolder: 'Upload folder',
        fileName: 'file name',
        folderName: 'folder name',
        inputMdText: 'Please enter Markdown text',
        selectNote: 'Please select a note',
    },
    '3d': {
        particleImage: {
            builtInTemplates: 'use built-in templates',
            sandpile: 'sandpile Logo',
            anemo: 'Genshin-anemo',
            cryo: 'Genshin-cryo',
            dendro: 'Genshin-dendro',
            electro: 'Genshin-electro',
            geo: 'Genshin-geo',
            hydro: 'Genshin-hydro',
            pyro: 'Genshin-pyro',
            particlesSize: 'Particle size',
            particlesMinGrayScale: 'Particle min grayscale',
            particlesMaxGrayScale: 'Particle max grayscale',
            particlesWidth: 'Particle pattern width',
            particlesHeight: 'Particle pattern height',
            particlesNumInWidth: 'Particle grids in X-axis',
            particlesNumInHeight: 'Particle grids in Y-axis',
            particlesGenerateWidth: 'Generate width',
            particlesGenerateMinDistance: 'Min generation distance',
            particlesGenerateMaxDistance: 'Max generation distance',
            particlesGenerateRetryLimit: 'Generate retry limit',
            particlesGenerateColorThreshold: 'Generate color threshold',
            particlesGenerateAlphaThreshold: 'Generate Opacity threshold',
            particlesGenerateSpeed: 'Particle initial velocity',
            particlesMaxSpeed: 'Particle max speed',
            selectTemplate: 'Select local template',
            regenerate: 'Regenerate',
            reload: 'Reload',
        },
    },
} as const;

export default messages;
