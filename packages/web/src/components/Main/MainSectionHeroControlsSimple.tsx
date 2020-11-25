import React, { useRef } from 'react'

import { delay } from 'lodash'
import { connect } from 'react-redux'
import { push } from 'connected-next-router'
import { useTranslation } from 'react-i18next'
import { Button, Col, Row } from 'reactstrap'
import { AlgorithmInputString } from 'src/io/AlgorithmInput'
import styled from 'styled-components'

import { getSequenceDatum } from 'src/algorithms/defaults/viruses'
import { FilePicker } from 'src/components/Main/FilePicker'
import { MainSectionHeroFeatures } from 'src/components/Main/MainSectionHeroFeatures'

import type { State } from 'src/state/reducer'
import type { AlgorithmInput, AlgorithmParams } from 'src/state/algorithm/algorithm.state'
import {
  algorithmRunWithSequencesAsync,
  exportCsvTrigger,
  removeFasta,
  setFasta,
  setIsDirty,
} from 'src/state/algorithm/algorithm.actions'
import { selectCanExport, selectParams } from 'src/state/algorithm/algorithm.selectors'
import { FileIconFasta } from './UploaderFileIcons'

export const FilePickerSimple = styled(FilePicker)`
  height: 100%;
`

export interface MainSectionHeroControlsProps {
  params: AlgorithmParams
  canExport: boolean

  setFasta(input: AlgorithmInput): void

  removeFasta(_0: unknown): void

  setIsDirty(isDirty: boolean): void

  algorithmRunTrigger(_0: unknown): void

  goToResults(): void
}

const mapStateToProps = (state: State) => ({
  params: selectParams(state),
  canExport: selectCanExport(state),
})

const mapDispatchToProps = {
  setIsDirty,
  setFasta: setFasta.trigger,
  removeFasta,
  algorithmRunTrigger: algorithmRunWithSequencesAsync.trigger,
  exportTrigger: () => exportCsvTrigger(),
  goToResults: () => push('/results'),
}

export const MainSectionHeroControlsSimple = connect(
  mapStateToProps,
  mapDispatchToProps,
)(MainSectionHeroControlsDisconnected)

export function MainSectionHeroControlsDisconnected({
  params,
  canExport,
  setIsDirty,
  algorithmRunTrigger,
  goToResults,
  setFasta,
  removeFasta,
}: MainSectionHeroControlsProps) {
  const { t } = useTranslation()
  const inputRef = useRef<HTMLInputElement | null>(null)

  function loadDefaultData() {
    setIsDirty(true)
    inputRef?.current?.focus()
    const seqData = getSequenceDatum(params.virus.name)
    delay(setFasta, 250, new AlgorithmInputString(seqData))
  }

  async function onUpload(input: AlgorithmInput) {
    setIsDirty(true)
    algorithmRunTrigger(input)
  }

  const errors: string[] = []

  // eslint-disable-next-line unicorn/consistent-function-scoping
  function onError() {}

  return (
    <Row noGutters className="hero-content">
      <Col xl={6} className="px-lg-4 hero-content-left">
        <MainSectionHeroFeatures />
      </Col>

      <Col xl={6} className="hero-content-right">
        <div className="hero-content-left-card">
          <Row>
            <Col>
              <FilePickerSimple
                canCollapse={false}
                defaultCollapsed={false}
                icon={<FileIconFasta />}
                text={t('Sequences')}
                input={params.raw.seqData}
                onInput={onUpload}
                errors={errors}
                onRemove={removeFasta}
                onError={onError}
                inputRef={inputRef}
              />
            </Col>
          </Row>

          <Row>
            <Col>
              <Button color="link" onClick={loadDefaultData}>
                <small>{t('Show me an Example')}</small>
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
    </Row>
  )
}
