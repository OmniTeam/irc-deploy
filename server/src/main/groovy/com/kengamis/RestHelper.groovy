package com.kengamis

import org.omni.rest.odkcentral.CentralRestClient

class RestHelper {

    static CentralRestClient getCentralRestClient() {
        def url = 'https://central.omnitech.co.ug'
        def username = 'vkakama@omnitech.co.ug'
        def password = 'omnitech123'
        def centralRestClient = new CentralRestClient(username, password,url)
        return centralRestClient
    }

    static def <T> T withCentral(@DelegatesTo(CentralRestClient) Closure<T> code) {
        def rc = centralRestClient
        code.delegate = rc
        return code()
    }
}
