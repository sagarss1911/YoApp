'use  strict'
let PermissionUrlModal = require('../../models/Admin/permission_url'),
    BadRequestError = require('../../errors/badRequestError'),
    PermissionModal = require('../../models/Admin/permission')

let getAllPermissionUrls = () => {
    return new Promise((resolve,reject) => {
        let permission_urls = [
            "/api/module_management/get_roles",
            "/api/module_management/add_role",
            "/api/module_management/update_role",
            "/api/module_management/remove_role",

            "/api/organization_management/get_organization_users",
            "/api/organization_management/add_organization_user",
            "/api/organization_management/update_organization_user",
            "/api/organization_management/remove_organization_user",

            "/api/candidate/parse_your_resume",
            "/api/candidate/get_all_candidates",
            "/api/candidate/add_new_candidate",
            "/api/candidate/candidate_details",
            "/api/candidate/update_candidate",
            "/api/candidate/remove_candidate",
            "/api/candidate/check_email",
            "/api/candidate/get_candidates_with_filters",
            "/api/candidate_log/get_candidate_job_placement_history",

            "/api/resource_master/resume",
            "/api/resource_master/share-interview",

            "/api/video-interview/schedule-interview",
            "/api/video-interview/interview-detail-by-candidate-id",
            "/api/video-interview/get-interview-video",
            "/api/video-interview/interview-token",
            "/api/video-interview/interview-detail",
            "/api/video-interview/submit-video-interview",
            "/api/video-interview/get-interview-video",
            "/api/video-interview/delete-interview",
            "/api/video-interview/resync-interview-answer-score",

            "/api/questions_master/get_questions",
            "/api/questions_master/add_question",
            "/api/questions_master/get_all_technology",

            "/api/client/add_client",
            "/api/client/update_client",
            "/api/client/remove_client",
            "/api/client/get_clients_with_filters",
            "/api/client/get_clients_with_fields",

            "/api/job/add_job",
            "/api/job/update_job",
            "/api/job/remove_job",
            "/api/job/get_jobs_with_filters",
            "/api/job/get_job_detail",
            "/api/job/get_jobs_list",
            "/api/job/share_candidate_by_email",
            "/api/job/share_candidate_with_clients",

            "/api/analytics/get_user_overall_analytics",
            "/api/analytics/get_candidate_job_graph_data",
            "/api/analytics/get_candidate_job_data_by_status",

            "/api/candidate_job/get_job_candidates",
            "/api/candidate_job/get_job_candidates_with_filters",
            "/api/candidate_job/change_candidate_job_status",
            "/api/candidate_job/accept_candidate_assign_request",
            "/api/candidate_job/decline_candidate_assign_request",

            "/api/notification/get_notifications_with_filters",
            "/api/organization_management/update_organization_data",

            "/api/email_system/contact_groups/get_contact_groups_with_filters",
            "/api/email_system/contact_groups/add_group",
            "/api/email_system/contact_groups/add_contacts_to_group",
            "/api/email_system/contact_groups/update_group",
            "/api/email_system/contact_groups/remove_email_group",
            "/api/email_system/contact_groups/add_comma_separated_to_group",
            "/api/email_system/contact_groups/clean_group_emails",

            "/api/email_system/contacts/get_contacts_with_filters",
            "/api/email_system/contacts/add_contact",
            "/api/email_system/contacts/remove_contact",
            "/api/email_system/contacts/update_contact",
            "/api/email_system/contacts/get_contacts_with_group_name_filters",

            "/api/organization_user/get_profile_data",
            "/api/organization_user/update_profile_data",

            "/api/licence/get_organization_licence",
            "/api/licence/get_organization_last_subscription",

            "/api/stripe/customers/get_customer",
            "/api/stripe/cards/get_cards",
            "/cards/create",
            "/cards/delete",
            "/api/stripe/customers/update",

            "/api/email_system/sender_verification/get_sender_email_list",
            "/api/email_system/sender_verification/get_all_sender_emails",
            "/api/email_system/sender_verification/add",
            "/api/email_system/sender_verification/update",
            "/api/email_system/sender_verification/delete",

            "/api/email_system/signature/get_all_signature",
            "/api/email_system/signature/add",
            "/api/email_system/signature/update",
            "/api/email_system/signature/delete",

            "/api/email_system/mass_mail/get_credits_with_filters",
            "/api/email_system/mass_mail/add_credits",
            "/api/email_system/mass_mail/revoke_credits",

            "/api/email_system/mass_mail/get_email_validation_credits_with_filters",
            "/api/email_system/mass_mail/add_email_validation_credits",
            "/api/email_system/mass_mail/revoke_validation_credits",

            "/api/email_system/mass_mail/get_mass_mail_with_filters",
            "/api/email_system/mass_mail/send_generic_email",

            "/api/expenses/add_expense",
            "/api/expenses/get_expense_with_filters",
            "/api/expenses/update_expense",
            "/api/expenses/remove_expense",
            "/api/expenses/add_recurring_expense",
            "/api/expenses/update_recurring_expense",
            "/api/expenses/get_recurring_expense_with_filters",
            "/api/expenses/remove_recurring_expense",

            "/api/career_portal/publish_jobs/publish_job_to_career_portal",
            "/api/career_portal/job_applications/archive_career_portal_job_application",
            "/api/career_portal/job_applications/get_career_portal_job_applications",

            "/api/organization_emails/get_org_communication_email_list",
            "/api/organization_emails/add",
            "/api/organization_emails/delete",
            "/api/organization_emails/update",
            "/api/organization_emails/resend_org_communication_sender_verification_email",

            "/api/interview_reminder/get_all_reminder",
            "/api/interview_reminder/add",
            "/api/interview_reminder/delete",
            "/api/interview_reminder/update",

            "/api/templates/email-templates/add_email_template",
            "/api/templates/email-templates/update_email_template",
            "/api/templates/email-templates/delete_email_template"
        ];
        return resolve(permission_urls)
    })
}

let addPermission = async (req) => {
    let body = req.body;
    if (!body.name) {
        throw new BadRequestError('Permission name can not empty');
    }
    if (!body.url.length) {
        throw new BadRequestError('Permission url can not empty');
    }
    let alreadyExist = await PermissionModal.findAll({ where: { name: body.name }, raw: true });
    if(alreadyExist.length) {
        throw new BadRequestError('Permission name already exist');
    }
    let permissionData = {
        name: body.name,
    }
    let permission = await PermissionModal.create(permissionData);
    if(permission.dataValues.id) {
       let permissionUrlData = []
       body.url.forEach(url => {
           permissionUrlData.push({permission_id : permission.dataValues.id, url : url})
       })
       let permissionUrl = await PermissionUrlModal.bulkCreate(permissionUrlData)
       let addedPermission = {}
       addedPermission.name = permission.dataValues.name
       addedPermission.urls = JSON.parse(JSON.stringify(permissionUrl)).map(x => x.url)
       return addedPermission;
    }
} 

let getAllPermissionList =async(body)=>{
    let limit = (body.limit) ? parseInt(body.limit) : 10;
    let page = body.page || 1;
    let offset = (page - 1) * limit;
    let findData = {}
    if (body.filters) {
        if (body.filters.searchtext) {
                findData["$or"] = [
                    {title: {$like: '%' + body.filters.searchtext + '%'}},
                ]
        }
    }
    let allPermission = await PermissionModal.findAll({
        where: findData,
        limit,
        offset,
        order: [['id', 'DESC']],
        raw: true
    });
    
    for(let i=0;i<allPermission.length;i++){
        allPermission[i].url = await PermissionUrlModal.findAll({
            where: {permission_id:allPermission[i].id},           
            raw: true
        });
        allPermission[i].url = allPermission[i].url.map(m=>m.url)
    }
    return allPermission;
}
let updatePermission = async(req)=>{
    let body = req.body.body ? JSON.parse(req.body.body) : req.body;
    
    if (!body.name) {
        throw new BadRequestError('Permission name can not empty');
    }
    if (!body.url.length) {
        throw new BadRequestError('Permission url can not empty');
    }
    // let alreadyExist = await PermissionModal.findAll({ where: { name: body.name }, raw: true });
    // if(alreadyExist.length) {
    //     throw new BadRequestError('Permission name already exist');
    // }
    let updateData = {};
    let optionalFiled = ["name"];
    optionalFiled.forEach(x => {
        if (body[x]) {
            updateData[x] = body[x];
        }
    });
    let permission = await PermissionModal.update(updateData, { where: { id: req.params.slider_id }, raw: true });
    console.log(permission)
    await PermissionUrlModal.destroy({ where: { permission_id: req.params.slider_id }})
    if(req.params.slider_id) {
        let permissionUrlData = []
        body.url.forEach(url => {
            permissionUrlData.push({permission_id : req.params.slider_id, url : url})
        })
        let permissionUrl = await PermissionUrlModal.bulkCreate(permissionUrlData)
        let addedPermission = {}
        addedPermission.name = body.name
        addedPermission.url = JSON.parse(JSON.stringify(permissionUrl)).map(x => x.url)
        return addedPermission;
    }
}

module.exports = {
    getAllPermissionUrls: getAllPermissionUrls,
    addPermission: addPermission,
    getAllPermissionList: getAllPermissionList,
    updatePermission: updatePermission
}