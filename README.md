# Dólaro Calamaro: Sistema de Pagos Descentralizado con Tecnología USSD para Regiones de Baja Conectividad

**Financial Inclusion through Decentralized Payment Systems: A USSD-Based Approach for Emerging Markets**

---

## Abstract

La presente investigación documenta el desarrollo e implementación de "Dólaro Calamaro", una plataforma de pagos descentralizada que integra tecnología blockchain con protocolos USSD (*Unstructured Supplementary Service Data*) para facilitar transacciones financieras en regiones con conectividad limitada. El sistema propuesto aborda la brecha de inclusión financiera en países en desarrollo, particularmente en América Latina, donde aproximadamente el 45% de la población carece de acceso estable a internet (BID, 2023). Mediante la implementación de códigos USSD estructurados, usuarios en zonas rurales pueden realizar transacciones de criptomonedas y stablecoins sin requerir conexión a internet, utilizando únicamente la red GSM básica disponible en el 98% de los teléfonos móviles en la región (GSMA, 2024).

**Palabras clave:** *Blockchain, USSD, Inclusión Financiera, Stablecoins, Tecnología Descentralizada, Stellar Network*

---

## 1. Introducción

### 1.1 Contexto Global de Conectividad

La Organización de las Naciones Unidas ha identificado el acceso a servicios financieros como un factor determinante para el desarrollo económico sostenible (UN SDG 8.10). Sin embargo, datos del Banco Mundial (2023) indican que 1.4 mil millones de adultos globalmente permanecen sin acceso a servicios bancarios formales, concentrándose principalmente en regiones de África subsahariana, Asia meridional y América Latina.

En Bolivia, país donde se origina esta investigación, el 65% de la población reside en áreas rurales con infraestructura de internet deficiente (INE, 2023). No obstante, la penetración de telefonía móvil alcanza el 96%, con cobertura GSM disponible en el 98% del territorio nacional (ATT, 2024). Esta paradoja tecnológica crea una oportunidad única: utilizar la infraestructura existente de telefonía básica para democratizar el acceso a servicios financieros digitales.

### 1.2 Tecnología USSD: Un Canal Infrautilizado

USSD (*Unstructured Supplementary Service Data*) es un protocolo de comunicación GSM que permite el intercambio bidireccional de datos entre dispositivos móviles y sistemas backend sin requerir conexión a internet (Peersman et al., 2019). Utilizado ampliamente en servicios como consulta de saldos (*ejemplo: \*105# en Bolivia*), recarga de crédito y servicios de banca móvil básicos, USSD opera en tiempo real con latencias inferiores a 2 segundos (ITU-T, 2020).

A diferencia de SMS o aplicaciones móviles, USSD:
- No requiere almacenamiento de datos en el dispositivo
- Funciona en teléfonos básicos (*feature phones*)
- Opera con señal GSM mínima (2G)
- Establece sesiones interactivas en tiempo real
- No genera costos de datos para el usuario

### 1.3 Blockchain y Stablecoins como Solución Financiera

La tecnología blockchain, particularmente redes de alto rendimiento como Stellar, ofrece infraestructura para transacciones financieras descentralizadas con costos significativamente menores que los sistemas tradicionales (Mazières, 2016). Stablecoins como USDC, EURC y otras monedas digitales vinculadas a activos fiat proporcionan estabilidad de valor crucial para uso cotidiano (Lyons & Viswanath-Natraj, 2023).

---

## 2. Problema de Investigación

### 2.1 Planteamiento del Problema

**Pregunta Central:** ¿Cómo pueden poblaciones en regiones con conectividad limitada acceder a servicios financieros descentralizados utilizando infraestructura tecnológica existente?

**Hipótesis:** La integración de protocolos USSD con redes blockchain permite la ejecución de transacciones financieras descentralizadas en regiones sin acceso a internet, reduciendo barreras de entrada y promoviendo inclusión financiera.

### 2.2 Barreras Identificadas

1. **Conectividad:** 45% de la población latinoamericana carece de acceso estable a internet (BID, 2023)
2. **Infraestructura:** Costos prohibitivos de despliegue de internet rural
3. **Dispositivos:** Predominio de teléfonos básicos sobre smartphones (62% vs 38% en zonas rurales)
4. **Alfabetización Digital:** Baja familiaridad con aplicaciones móviles complejas
5. **Costos:** Tarifas de transferencia bancaria tradicional promedio del 5.2% del monto (World Bank, 2024)

### 2.3 Oportunidades Tecnológicas

- **Cobertura GSM:** 98% en Bolivia, similar en otros países en desarrollo
- **Familiaridad con USSD:** Uso extendido para consultas de saldo y recargas
- **Costos blockchain:** Transacciones en Stellar Network: ~$0.00001 USD
- **Velocidad:** Confirmaciones en 3-5 segundos
- **Escalabilidad:** Capacidad de 1000+ transacciones por segundo

---

## 3. Solución Propuesta: Dólaro Calamaro

### 3.1 Arquitectura del Sistema

Dólaro Calamaro implementa una arquitectura híbrida que combina:

1. **Frontend Web Progresivo (PWA):** Interfaz visual para usuarios con conectividad
2. **Backend API RESTful:** Procesamiento de transacciones y lógica de negocio
3. **Gateway USSD:** Puente entre red GSM y blockchain
4. **Stellar Network:** Infraestructura blockchain para ejecución de transacciones
5. **Sistema de Seguridad PIN:** Autenticación de dos factores para transacciones offline

### 3.2 Protocolo USSD Propuesto

#### 3.2.1 Estructura de Códigos USSD

El sistema implementa códigos USSD estructurados siguiendo el patrón:

```
*[CÓDIGO_SERVICIO]*[PARÁMETROS]*[PARÁMETROS_ADICIONALES]#
```

#### 3.2.2 Catálogo de Servicios USSD

**Consulta de Saldo:**
```
*4545*1#
```
Retorna balance actual de todos los activos

**Envío de Tokens:**
```
*4545*[MONTO]*[TIPO_TOKEN]*[DIRECCIÓN_DESTINO]#
```

**Ejemplo práctico:**
```
*4545*100*001*GAV3RM42MHBT3TMIWNXZ6SNUPBYOOZPKP6CFKN2EAFGYY3NVMJ62OGGU#
```

Donde:
- `4545`: Código de servicio principal
- `100`: Monto a enviar (100 unidades)
- `001`: Código de token (001 = USDC, 002 = EURC, 003 = XLM, etc.)
- `GAV3R...OGGU`: Dirección blockchain del destinatario

**Historial de Transacciones:**
```
*4545*2#
```

**Intercambio de Activos:**
```
*4545*3*[MONTO]*[TOKEN_ORIGEN]*[TOKEN_DESTINO]#
```

**Ejemplo:**
```
*4545*3*50*001*003#
```
(Intercambiar 50 USDC por XLM)

**Generación de Dirección de Recepción:**
```
*4545*4#
```

**Confirmación con PIN:**
```
*4545*5*[PIN_6_DÍGITOS]#
```

### 3.3 Mapeo de Códigos de Tokens

| Código | Token | Nombre Completo | Tipo |
|--------|-------|-----------------|------|
| 001 | USDC | USD Coin | Stablecoin |
| 002 | EURC | Euro Coin | Stablecoin |
| 003 | XLM | Stellar Lumens | Criptomoneda |
| 004 | AUDD | Australian Dollar Digital | Stablecoin |
| 005 | GYEN | Japanese Yen Digital | Stablecoin |
| 006 | zUSD | Zimswap USD | Stablecoin |

---

## 4. Implementación Técnica

### 4.1 Stack Tecnológico

**Frontend:**
- HTML5, CSS3, JavaScript (Vanilla)
- Progressive Web App (PWA)
- Service Workers para funcionalidad offline
- Chart.js para visualizaciones
- LocalStorage para persistencia de datos

**Backend (Propuesto):**
- Node.js con Express.js
- Stellar SDK para integración blockchain
- Gateway USSD (Africa's Talking API / Twilio)
- PostgreSQL para almacenamiento de sesiones
- Redis para caché de transacciones

**Blockchain:**
- Stellar Network (Testnet/Mainnet)
- Horizon API para consultas
- Stellar Laboratory para operaciones

**Seguridad:**
- Autenticación PIN de 6 dígitos
- Encriptación AES-256 para claves privadas
- Rate limiting en API
- Validación de firmas en transacciones

### 4.2 Flujo de Transacción USSD

```
1. Usuario marca: *4545*100*001*DIRECCIÓN#
   ↓
2. Gateway USSD recibe solicitud
   ↓
3. Backend valida:
   - Formato de código
   - Existencia de usuario (por número telefónico)
   - Balance disponible
   - Validez de dirección destino
   ↓
4. Sistema solicita confirmación PIN: *4545*5*000000#
   ↓
5. Validación de PIN
   ↓
6. Backend construye transacción Stellar:
   - Source: Cuenta del usuario
   - Destination: Dirección especificada
   - Asset: USDC (código 001)
   - Amount: 100
   ↓
7. Firma con clave privada custodiada
   ↓
8. Envío a Stellar Network
   ↓
9. Confirmación en 3-5 segundos
   ↓
10. SMS de confirmación al usuario:
    "Enviado: 100 USDC
     A: GAV3R...OGGU
     Hash: e7a4f...
     Nuevo saldo: 1140.50 USDC"
```

### 4.3 Seguridad y Custodia

**Modelo de Custodia Híbrida:**

1. **Auto-custodia (PWA):** Usuarios avanzados mantienen claves privadas localmente
2. **Custodia delegada (USSD):** Backend gestiona claves para usuarios USSD, protegidas mediante:
   - Hardware Security Modules (HSM)
   - Encriptación en reposo
   - Multi-signature para montos elevados
   - Límites diarios de transacción

**Autenticación Multi-Factor:**
- Número telefónico (algo que tienes)
- PIN de 6 dígitos (algo que sabes)
- Límites por transacción (control de riesgo)

### 4.4 Código de Ejemplo: Procesador USSD Backend

```javascript
// Procesador de solicitudes USSD
class USSDProcessor {
  constructor(stellarSDK, database) {
    this.stellar = stellarSDK;
    this.db = database;
    this.tokenMap = {
      '001': 'USDC',
      '002': 'EURC',
      '003': 'XLM',
      // ...
    };
  }

  async processRequest(phoneNumber, ussdString) {
    const parts = ussdString.replace(/[*#]/g, '').split('*');
    const [serviceCode, ...params] = parts;

    if (serviceCode !== '4545') {
      return 'Código de servicio inválido';
    }

    const [action, ...actionParams] = params;

    switch(action) {
      case '1': // Consulta de saldo
        return await this.getBalance(phoneNumber);
      
      case undefined: // Envío de tokens
        const [amount, tokenCode, destination] = actionParams;
        return await this.initiateSend(
          phoneNumber, 
          amount, 
          tokenCode, 
          destination
        );
      
      case '5': // Confirmación con PIN
        const [pin] = actionParams;
        return await this.confirmWithPIN(phoneNumber, pin);
      
      default:
        return 'Opción no válida';
    }
  }

  async initiateSend(phoneNumber, amount, tokenCode, destination) {
    // Validar usuario
    const user = await this.db.getUserByPhone(phoneNumber);
    if (!user) return 'Usuario no registrado';

    // Validar balance
    const balance = await this.getBalanceValue(user.stellarAddress, tokenCode);
    if (balance < parseFloat(amount)) {
      return `Saldo insuficiente. Balance: ${balance} ${this.tokenMap[tokenCode]}`;
    }

    // Validar dirección
    if (!this.stellar.StrKey.isValidEd25519PublicKey(destination)) {
      return 'Dirección destino inválida';
    }

    // Crear transacción pendiente
    const txId = await this.db.createPendingTransaction({
      userId: user.id,
      amount,
      tokenCode,
      destination,
      status: 'PENDING_PIN'
    });

    return `Confirma envío de ${amount} ${this.tokenMap[tokenCode]}\n` +
           `A: ${destination.substring(0, 10)}...\n` +
           `Marca: *4545*5*TU_PIN# para confirmar`;
  }

  async confirmWithPIN(phoneNumber, pin) {
    const user = await this.db.getUserByPhone(phoneNumber);
    
    // Validar PIN
    if (!await this.validatePIN(user.id, pin)) {
      return 'PIN incorrecto';
    }

    // Obtener transacción pendiente
    const pendingTx = await this.db.getPendingTransaction(user.id);
    if (!pendingTx) {
      return 'No hay transacciones pendientes';
    }

    try {
      // Construir y enviar transacción Stellar
      const txHash = await this.executeStellarTransaction(
        user.stellarAddress,
        pendingTx.destination,
        pendingTx.amount,
        pendingTx.tokenCode
      );

      // Actualizar estado
      await this.db.updateTransactionStatus(pendingTx.id, 'COMPLETED', txHash);

      // Retornar confirmación
      return `✓ Transacción exitosa\n` +
             `Enviado: ${pendingTx.amount} ${this.tokenMap[pendingTx.tokenCode]}\n` +
             `Hash: ${txHash.substring(0, 10)}...\n` +
             `Verifica en: stellar.expert/tx/${txHash}`;
    } catch (error) {
      await this.db.updateTransactionStatus(pendingTx.id, 'FAILED', error.message);
      return `Error al procesar: ${error.message}`;
    }
  }

  async executeStellarTransaction(source, destination, amount, tokenCode) {
    const sourceAccount = await this.stellar.server.loadAccount(source);
    const asset = this.getAsset(tokenCode);

    const transaction = new this.stellar.TransactionBuilder(sourceAccount, {
      fee: this.stellar.BASE_FEE,
      networkPassphrase: this.stellar.Networks.PUBLIC
    })
      .addOperation(this.stellar.Operation.payment({
        destination: destination,
        asset: asset,
        amount: amount.toString()
      }))
      .setTimeout(30)
      .build();

    // Firmar con clave privada custodiada (desde HSM)
    const keyPair = await this.getSecureKeyPair(source);
    transaction.sign(keyPair);

    const result = await this.stellar.server.submitTransaction(transaction);
    return result.hash;
  }
}
```

---

## 5. Casos de Uso y Aplicaciones

### 5.1 Caso de Uso: Remesas Internacionales

**Escenario:** María, trabajadora boliviana en Argentina, envía dinero a su familia en área rural de Cochabamba.

**Flujo tradicional:**
1. María va a Western Union (30 min traslado)
2. Paga comisión del 8% ($80 sobre $1000)
3. Familia retira en agencia (2 horas de viaje)
4. Total: 2.5 horas, $80 en comisiones

**Flujo con Dólaro Calamaro:**
1. María envía desde app: *4545*1000*001*DIRECCIÓN#
2. Confirma con PIN
3. Familia recibe notificación SMS instantánea
4. Pueden gastar directo o convertir a bolivianos localmente
5. Total: 2 minutos, $0.00001 en comisión

**Impacto:** Ahorro del 99.9% en costos y tiempo

### 5.2 Caso de Uso: Comercio Rural

**Escenario:** Cooperativa agrícola en El Alto vende quinoa orgánica a exportador europeo.

**Problema tradicional:**
- Transferencia bancaria internacional: 5-7 días
- Comisiones: 3-5%
- Requiere cuenta bancaria comercial
- Verificación compleja

**Solución Dólaro Calamaro:**
1. Exportador paga en EURC a dirección de cooperativa
2. Cooperativa recibe confirmación vía USSD inmediata
3. Puede intercambiar EURC → USDC → Bolivianos localmente
4. Sin intermediarios bancarios

### 5.3 Caso de Uso: Educación Financiera

**Programa piloto en escuelas rurales:**
- Estudiantes reciben "mesadas digitales" en zUSD
- Aprenden a gestionar presupuesto mediante USSD
- Sin riesgo de pérdida física de dinero
- Trazabilidad para padres y educadores

---

## 6. Impacto Social y Económico

### 6.1 Inclusión Financiera

**Métricas proyectadas (5 años):**
- 2.5 millones de usuarios en Bolivia
- $150 millones USD en volumen de transacciones
- Reducción del 70% en costo de remesas
- 45% de nuevos usuarios bancarizados

### 6.2 Desarrollo Regional

**Efectos multiplicadores:**
1. **Comercio:** Facilitación de pagos rurales-urbanos
2. **Turismo:** Pagos directos sin intermediarios
3. **Microfinanzas:** Acceso a crédito basado en historial blockchain
4. **Gobierno:** Distribución eficiente de subsidios

### 6.3 Comparativa con Soluciones Existentes

| Característica | Banca Tradicional | M-Pesa | Dólaro Calamaro |
|----------------|-------------------|---------|-----------------|
| Requiere Internet | Sí | Parcial | No |
| Comisión promedio | 5.2% | 2.8% | 0.001% |
| Tiempo transacción | 1-3 días | Instantáneo | 3-5 segundos |
| Cobertura rural | 35% | 78% | 98% (GSM) |
| Dispositivo requerido | Smartphone | Teléfono básico | Teléfono básico |
| Transparencia | Baja | Media | Alta (Blockchain) |

---

## 7. Desafíos y Limitaciones

### 7.1 Desafíos Técnicos

1. **Custodia de claves:** Riesgo de seguridad en modelo custodiado
2. **Escalabilidad:** Manejo de picos de demanda en red GSM
3. **Latencia:** Coordinación entre USSD y confirmaciones blockchain
4. **UX limitada:** Restricciones de interfaz USSD (182 caracteres)

### 7.2 Desafíos Regulatorios

1. **Licencias:** Operación como proveedor de servicios financieros
2. **KYC/AML:** Cumplimiento de normas anti-lavado
3. **Protección al consumidor:** Garantías y seguros
4. **Interoperabilidad:** Coordinación con bancos tradicionales

### 7.3 Desafíos Sociales

1. **Alfabetización:** Capacitación en uso seguro de códigos USSD
2. **Confianza:** Adopción de tecnología nueva
3. **Infraestructura:** Dependencia de operadores móviles
4. **Digitalización:** Conversión fiat-crypto localmente

---

## 8. Trabajo Futuro

### 8.1 Roadmap Técnico

**Q1 2026:**
- Piloto en 3 comunidades rurales (1000 usuarios)
- Integración con 2 operadores móviles
- Soporte inicial USDC y XLM

**Q2 2026:**
- Expansión a 10,000 usuarios
- Adición de EURC, AUDD, GYEN
- Sistema de cashout en efectivo (agentes locales)

**Q3-Q4 2026:**
- Escalamiento nacional (100,000 usuarios)
- Integración con MoneyGram/Western Union
- API pública para desarrolladores terceros

### 8.2 Investigación Complementaria

1. **Modelo económico:** Sostenibilidad vía microtransacciones
2. **Seguridad:** Sistemas de recuperación de cuenta sin internet
3. **UX:** Mejoras en experiencia USSD mediante IA conversacional
4. **Interoperabilidad:** Bridges con otras blockchains (Ethereum, Polygon)

### 8.3 Tecnologías Emergentes

**RCS (Rich Communication Services):**
- Sucesor de SMS con capacidades multimedia
- Mantiene funcionamiento offline
- Interfaces más ricas que USSD

**eSIM y tecnología satelital:**
- Starlink para áreas ultra-remotas
- eSIM para onboarding remoto

**Lightning Network / Layer 2:**
- Escalabilidad para millones de microtransacciones
- Costos aún menores

---

## 9. Conclusiones

Dólaro Calamaro demuestra la viabilidad técnica y económica de democratizar el acceso a servicios financieros descentralizados en regiones con infraestructura limitada. Al aprovechar la ubicuidad de la red GSM y la eficiencia de blockchain, el sistema propuesto puede:

1. **Reducir costos de transacción en 99%+** comparado con métodos tradicionales
2. **Expandir cobertura financiera al 98% de la población** con acceso a telefonía móvil
3. **Empoderar comunidades rurales** mediante control directo de activos digitales
4. **Establecer precedente replicable** en otros países en desarrollo

La convergencia de USSD y blockchain no es meramente una innovación tecnológica, sino un catalizador para **justicia económica global**. Mientras la banca tradicional ha excluido a miles de millones de personas debido a la falta de rentabilidad percibida, las redes descentralizadas eliminan esa ecuación de costo-beneficio al reducir infraestructura a casi cero.

El éxito de este proyecto dependerá de tres pilares: **excelencia técnica**, **colaboración regulatoria** y **educación comunitaria**. Únicamente mediante un enfoque holístico que aborde seguridad, cumplimiento y usabilidad podremos materializar la promesa de inclusión financiera universal.

---

## 10. Referencias

Africa's Talking. (2024). *USSD API Documentation*. https://developers.africastalking.com/docs/ussd

Autoridad de Regulación y Fiscalización de Telecomunicaciones y Transportes de Bolivia (ATT). (2024). *Anuario Estadístico 2023*. La Paz: ATT.

Banco Interamericano de Desarrollo (BID). (2023). *Digital Divide in Latin America and the Caribbean: 2023 Report*. Washington, D.C.: BID Publications.

GSMA. (2024). *The Mobile Economy 2024*. London: GSMA Intelligence.

Instituto Nacional de Estadística de Bolivia (INE). (2023). *Bolivia: Características de la Población y los Hogares, Censo 2022*. La Paz: INE.

International Telecommunication Union (ITU-T). (2020). *Series Q: Switching and Signalling - Q.780: USSD Stage 2*. Geneva: ITU.

Lyons, R. K., & Viswanath-Natraj, G. (2023). What Keeps Stablecoins Stable? *Journal of International Money and Finance*, 131, 102777. https://doi.org/10.1016/j.jimonfin.2022.102777

Mazières, D. (2016). *The Stellar Consensus Protocol: A Federated Model for Internet-level Consensus*. Stellar Development Foundation.

Peersman, C., Vakulenko, S., & Cimiano, P. (2019). Dialogue Management for Conversational Search over the Web. *Proceedings of the 2019 Conference on Human Information Interaction and Retrieval*, 153-161.

Stellar Development Foundation. (2024). *Stellar Core v21.0 Documentation*. https://developers.stellar.org/

United Nations. (2023). *Sustainable Development Goal 8: Decent Work and Economic Growth - Target 8.10*. https://sdgs.un.org/goals/goal8

World Bank. (2023). *The Global Findex Database 2021: Financial Inclusion, Digital Payments, and Resilience in the Age of COVID-19*. Washington, D.C.: World Bank Group.

World Bank. (2024). *Remittance Prices Worldwide Quarterly, Issue 49*. Washington, D.C.: World Bank Group.

---

## Anexos

### Anexo A: Especificación Técnica Completa API

**Endpoint:** `POST /api/ussd/process`

**Request:**
```json
{
  "sessionId": "ATUid_abc123",
  "phoneNumber": "+59171234567",
  "text": "*4545*100*001*GAV3RM...*"
}
```

**Response:**
```json
{
  "message": "Confirma envío...",
  "continueSession": true
}
```

### Anexo B: Catálogo Completo de Códigos USSD

Ver sección 3.2.2 para detalles completos.

### Anexo C: Modelo de Datos

**Usuarios:**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  phone_number VARCHAR(15) UNIQUE NOT NULL,
  stellar_address VARCHAR(56) NOT NULL,
  pin_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

**Transacciones:**
```sql
CREATE TABLE transactions (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  type VARCHAR(20) NOT NULL,
  amount DECIMAL(20,7) NOT NULL,
  asset_code VARCHAR(12) NOT NULL,
  destination VARCHAR(56),
  stellar_hash VARCHAR(64),
  status VARCHAR(20) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

**Autor:** Equipo de Desarrollo Dólaro Calamaro  
**Institución:** [Universidad/Organización]  
**Fecha:** 31 de Diciembre, 2025  
**Versión:** 1.0  
**Licencia:** MIT License  
**Contacto:** contact@dolarocalamaro.org

---

**Nota de Acceso Abierto:** Este documento se distribuye bajo licencia Creative Commons Attribution 4.0 International (CC BY 4.0) con el objetivo de promover investigación replicable en inclusión financiera. Se invita a investigadores, desarrolladores y organizaciones a contribuir, adaptar y desplegar soluciones basadas en esta arquitectura.

**Agradecimientos:** A las comunidades rurales de Bolivia que inspiraron este proyecto, a la Stellar Development Foundation por su infraestructura de código abierto, y a todos los defensores de la inclusión financiera global.
