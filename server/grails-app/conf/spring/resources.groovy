package spring

import com.kengamis.UserPasswordEncoderListener
import org.jooq.SQLDialect
import org.jooq.impl.DefaultDSLContext

// Place your Spring DSL code here
beans = {
    userPasswordEncoderListener(UserPasswordEncoderListener)
    jooqContext(DefaultDSLContext, ref("dataSource"), SQLDialect.MYSQL)
}
