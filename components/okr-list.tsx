"use client";
import * as React from 'react';
import type { OKR, StrategicTheme, KeyResult } from '@/lib/types';
import { usePlanner } from '@/lib/store';
import { calcKRProgress, calcOKRProgress } from '@/lib/metrics';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { uid } from '@/lib/utils';

export function OKRList({ theme }: { theme: StrategicTheme }) {
  const { updateOKR, addOKR, addKR, updateKR } = usePlanner((s) => ({
    updateOKR: s.updateOKR,
    addOKR: s.addOKR,
    addKR: s.addKR,
    updateKR: s.updateKR
  }));

  const [open, setOpen] = React.useState(false);
  const [oTitle, setOTitle] = React.useState('');
  const [oQuarter, setOQuarter] = React.useState('2025-Q4');

  const createOKR = () => {
    if (!oTitle.trim()) return;
    const okr: OKR = { id: uid('okr'), objective: oTitle.trim(), quarter: oQuarter, keyResults: [] };
    addOKR(theme.id, okr);
    setOTitle('');
    setOpen(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-sm font-semibold">OKR — {theme.title}</div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">New OKR</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create OKR</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div>
                <div className="text-sm mb-1">Objective</div>
                <Input value={oTitle} onChange={(e) => setOTitle(e.target.value)} />
              </div>
              <div>
                <div className="text-sm mb-1">Quarter</div>
                <Input value={oQuarter} onChange={(e) => setOQuarter(e.target.value)} />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={createOKR}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      <div className="space-y-3">
        {theme.okrs.map((okr) => (
          <div key={okr.id} className="card p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{okr.objective}</div>
                <div className="text-xs text-muted-foreground">{okr.quarter}</div>
              </div>
              <div className="text-xs">{Math.round(calcOKRProgress(okr) * 100)}%</div>
            </div>
            <div className="mt-2 space-y-2">
              {okr.keyResults.map((kr) => (
                <KRRow key={kr.id} themeId={theme.id} okrId={okr.id} kr={kr} />)
              )}
              <AddKR themeId={theme.id} okrId={okr.id} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function KRRow({ themeId, okrId, kr }: { themeId: string; okrId: string; kr: KeyResult }) {
  const { updateKR } = usePlanner((s) => ({ updateKR: s.updateKR }));
  const [title, setTitle] = React.useState(kr.title);
  const [current, setCurrent] = React.useState(String(kr.current));
  const [target, setTarget] = React.useState(String(kr.target));
  const ratio = calcKRProgress({ ...kr, current: Number(current), target: Number(target) });
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
      <Input className="sm:col-span-2" value={title} onChange={(e) => setTitle(e.target.value)} onBlur={() => updateKR(themeId, okrId, kr.id, { title })} />
      <Input value={current} onChange={(e) => setCurrent(e.target.value)} onBlur={() => updateKR(themeId, okrId, kr.id, { current: Number(current) })} />
      <Input value={target} onChange={(e) => setTarget(e.target.value)} onBlur={() => updateKR(themeId, okrId, kr.id, { target: Number(target) })} />
      <div className="text-xs text-right">{Math.round(ratio * 100)}%</div>
    </div>
  );
}

function AddKR({ themeId, okrId }: { themeId: string; okrId: string }) {
  const { addKR } = usePlanner((s) => ({ addKR: s.addKR }));
  const [title, setTitle] = React.useState('');
  const [target, setTarget] = React.useState('100');
  const create = () => {
    if (!title.trim()) return;
    addKR(themeId, okrId, { id: uid('kr'), title: title.trim(), current: 0, target: Number(target) });
    setTitle('');
    setTarget('100');
  };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
      <Input className="sm:col-span-2" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="New KR" />
      <div className="text-xs text-muted-foreground">cur: 0</div>
      <Input value={target} onChange={(e) => setTarget(e.target.value)} />
      <div className="text-right"><Button size="sm" onClick={create}>Add KR</Button></div>
    </div>
  );
}

